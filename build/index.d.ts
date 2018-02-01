export interface ICronologCommand {
    exe: string;
    args: any[];
    cwd: string;
}
export interface ICronologTask {
    name: string;
    when?: string;
    cmd: ICronologCommand;
    dependsOn: string;
}
export interface ICronologConfig {
    tasks: ICronologTask[];
}
export declare class Cronolog {
    config: ICronologConfig;
    constructor(config: ICronologConfig);
    log(msg: string): Promise<void>;
    taskStarted(task: ICronologTask): Promise<void>;
    taskComplete(task: ICronologTask): Promise<void>;
    taskErrored(task: ICronologTask, err: any): Promise<void>;
    runTaskDependees(task: ICronologTask, taskMap: any): Promise<void>;
    runTask(task: ICronologTask, taskMap: any): Promise<void>;
    scheduleTasks(): void;
}
