
import * as moment from 'moment';
import { assert } from 'chai';
import { spawn } from './lib/spawn';
import { Log } from './lib/log';

var cron = require('node-cron');

//
// Helper function to map an array of objects.
//
function toMap(items: any[], keySelector: (item: any) => any, valueSelector: (item: any) => any): any {
    let output: any = {};
    for (const item of items) {
        var key = keySelector(item);
        output[key] = valueSelector(item);
    }
    return output;
}

//
// Represents a single command.
//
export interface ICronologCommand {

    //
    // The path to the executable to be invoked.
    //
    exe: string;

    //
    // Arguments to be passed to the command.
    // These will be converted to strings.
    //
    args: any[],

    //
    // The working directory in which to run the command.
    //
    cwd: string;
}

// 
// Represents a task that can be scheduled.
//
export interface ICronologTask {
    
    //
    // The name of the task.
    //
    name: string;
    
    //
    // Cron specification as to when the task will execute.
    //
    when?: string;

    //
    // The command to execute at the scheduled time.
    //
    cmd: ICronologCommand;

    //
    // Names another task that this task depends on.
    //
    dependsOn: string;
};

//
// Configuration object for cronolog.
// Defines the tasks to run and when to run them.
//
export interface ICronologConfig {

    //
    // List of tasks to be scheduled.
    //
    tasks: ICronologTask[];
}

//
// The Cronolog task scheduler.
//
export class Cronolog {
    
    config: ICronologConfig;

    constructor(config: ICronologConfig) {
        assert.isObject(config, "Invalid config object passed to Cronolog constructor.");

        this.config = config;
    }

    //
    // Log events as they occur.
    //
    log (msg: string): void {
        // Built on promises for future compatibility.
        console.log(msg);
    }

    //
    // Reports that a task has started.
    //
    async taskStarted (task: ICronologTask): Promise<void> {
        // Built on promises for future compatibility.
        this.log("Task " + task.name + " has started."); //TODO: include the datetime it started.
    }

    //
    // Reports that a task has completed.
    //
    async taskComplete (task: ICronologTask): Promise<void> {
        // Built on promises for future compatibility.
        //todo: write to log file.
        this.log("Task " + task.name + " has completed with no error."); //TODO: include the datetime it endeed. Include the duration of the task.
    }

    //
    // Reports that a task has errored.
    //
    async taskErrored (task: ICronologTask, err: any): Promise<void> {
        // Built on promises for future compatibility.

        let errMsg = null;
        if (err.stack) {
            errMsg = err.stack.toString();
        }
        else {
            errMsg = err.toString();
        }

        //TODO: include the datetime it errored. Include the duration of the task.
        this.log("Task " + task.name + " has errorred.\n" + errMsg);
    }

    //
    // Run the tasks that another task is dependant on.
    //
    async runTaskDependees (task: ICronologTask, taskMap: any): Promise<void> {
        if(task.dependsOn) {
            const dependee = taskMap[task.dependsOn];
            if (!dependee) {
                throw new Error("Failed to find task " + task.dependsOn + " that is depended upon by task " + task.name);
            }

            await this.runTask(dependee, taskMap);
        }
    }

    //
    // Run a task immediately.
    // Runs asyncronously and resolves when the task has completed (or has errorred)
    //
    async runTask (task: ICronologTask, taskMap: any): Promise<void> {

        //
        // First run the tasks we are dependent on.
        //
        await this.runTaskDependees(task, taskMap);

        await this.taskStarted(task);

        const log = new Log(task.name);

        try {
            await spawn(log, task.cmd.exe, task.cmd.args, task.cmd.cwd);

            await this.taskComplete(task);
        }
        catch (err) {
            await this.taskErrored(task, err);
        }
        finally {
            log.close();
        }
    }

    //
    // Schedule all tasks for execution.
    //
    scheduleTasks (): void {

        const taskMap = toMap(this.config.tasks,
                task => task.name,
                task => task
            );

        for (const task of this.config.tasks) {
            if (task.when) {
                this.log("Scheduling task " + task.name);

                cron.schedule(task.when, () => {
                    this.runTask(task, taskMap)
                        .catch(err => {
                            console.error("Unhandled exception while running task " + task.name);
                            console.error(err.stack || err);
                        })
                });
            }
        }
    };
}