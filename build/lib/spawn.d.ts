import { ITaskLog } from './task-log';
export declare function spawn(log: ITaskLog, cmd: string, args: string[], cwd?: string): Promise<string>;
