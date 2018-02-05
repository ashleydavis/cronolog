
import * as moment from 'moment';
import { assert } from 'chai';
import { spawn } from './lib/spawn';
import { TaskLog } from './lib/task-log';
import { ScheduleLog } from './lib/schedule-log';
import { argv } from 'yargs';
import * as Sugar from 'sugar';

var cron = require('node-cron');
var prettyCron = require('prettycron');

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
    args?: any[],

    //
    // The working directory in which to run the command.
    //
    cwd?: string;
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
    dependsOn: string[] | string;
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
    scheduleLog = new ScheduleLog();

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
        this.log("Task " + task.name + " has started.");

        this.scheduleLog.taskStarted(task);
    }

    //
    // Reports that a task has completed.
    //
    async taskComplete (task: ICronologTask): Promise<void> {
        // Built on promises for future compatibility.
        //todo: write to log file.
        this.log("Task " + task.name + " has completed with no error."); //TODO: include the datetime it endeed. Include the duration of the task.

        this.scheduleLog.taskCompleted(task);
    }

    //
    // Reports that a task has errored.
    //
    async taskErrored (task: ICronologTask, err: any): Promise<void> {
        // Built on promises for future compatibility.

        let errMsg = "";
        if (err.stack) {
            errMsg = err.stack.toString();
        }
        else {
            errMsg = err.toString();
        }

        //TODO: include the datetime it errored. Include the duration of the task.
        this.log("Task " + task.name + " has errorred.\n" + errMsg);

        this.scheduleLog.taskErrored(task, errMsg);
    }

    /*
     * Run a single dependee task.
     */
    async runTaskDependee (dependeeName: string, dependentName: string, taskMap: any) {
        const dependee = taskMap[dependeeName];
        if (!dependee) {
            throw new Error("Failed to find task " + dependeeName + " that is depended upon by task " + dependentName);
        }

        await this.runTask(dependee, taskMap);        
    }

    //
    // Run the tasks that another task is dependant on.
    //
    async runTaskDependees (task: ICronologTask, taskMap: any): Promise<void> {
        if(task.dependsOn) {
            if (Sugar.Object.isArray(task.dependsOn)) {
                for (const dependeeName of task.dependsOn) {
                    await this.runTaskDependee(dependeeName, task.name, taskMap);
                }
            }
            else {
                await this.runTaskDependee(task.dependsOn, task.name, taskMap);
            }
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

        const log = new TaskLog(task.name);

        try {
            await spawn(log, argv.copyOutput, task.cmd.exe, task.cmd.args || [], task.cmd.cwd);

            await this.taskComplete(task);

            if (task.when) {
                this.log(task.name + " will next run: " + prettyCron.getNext(task.when));
            }
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

        const scheduledTasks = this.config.tasks.filter(task => task.when);
        if (scheduledTasks.length === 0) {
            throw new Error("Found no scheduled tasks.");
        }

        for (const task of scheduledTasks) {
            this.log("Task:      " + task.name);
            this.log("Schedule:  " + task.when);
            this.log("Frequency: " + prettyCron.toString(task.when));
            this.log("Next:      " + prettyCron.getNext(task.when));

            cron.schedule(task.when, () => {
                this.runTask(task, taskMap)
                    .catch(err => {
                        console.error("Unhandled exception while running task " + task.name);
                        console.error(err.stack || err);
                    })
            });
        }
    };
}