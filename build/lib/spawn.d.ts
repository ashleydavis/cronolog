import { ILog } from './log';
export declare function spawn(log: ILog, cmd: string, args: string[], cwd?: string): Promise<string>;
