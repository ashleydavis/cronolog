import { ITaskLog } from './task-log';
export declare function spawn(log: ITaskLog, copyOutput: boolean, cmd: string, args: string[], cwd?: string): Promise<string>;
