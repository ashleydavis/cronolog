import { ICronologTask } from '../index';
export interface IScheduleLog {
    taskStarted(task: ICronologTask): void;
    taskCompleted(task: ICronologTask): void;
    taskErrored(task: ICronologTask, errMsg: string): void;
}
export declare class ScheduleLog implements IScheduleLog {
    outputFilePath: string;
    constructor();
    tasksInFlight: any;
    taskStarted(task: ICronologTask): void;
    private writeCSV(task, result, errMsg?);
    taskCompleted(task: ICronologTask): void;
    taskErrored(task: ICronologTask, errMsg: string): void;
}
