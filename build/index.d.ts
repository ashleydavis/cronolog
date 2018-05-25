import { ScheduleLog } from './lib/schedule-log';
export interface ICronologCommand {
    exe: string;
    args?: any[];
    cwd?: string;
}
export interface ICronologTask {
    name: string;
    when?: string;
    cmd: ICronologCommand;
    dependsOn: string[] | string;
}
export interface ICronologConfig {
    tasks: ICronologTask[];
}
export declare class Cronolog {
    config: ICronologConfig;
    scheduleLog: ScheduleLog;
    constructor(config: ICronologConfig);
    log(msg: string): void;
    taskStarted(task: ICronologTask): Promise<void>;
    taskComplete(task: ICronologTask): Promise<void>;
    taskErrored(task: ICronologTask, err: any): Promise<void>;
    runTaskDependee(dependeeName: string, dependentName: string, taskMap: any): Promise<boolean>;
    runTaskDependees(task: ICronologTask, taskMap: any): Promise<boolean>;
    runTask(task: ICronologTask, taskMap: any): Promise<boolean>;
    scheduleTasks(): void;
}
