/// <reference types="node" />
import * as fs from 'fs-extra';
export interface ILog {
    write(msg: string): void;
    error(msg: string): void;
}
export declare class Log implements ILog {
    stdout: fs.WriteStream;
    stderr: fs.WriteStream;
    constructor(taskName: string);
    write(msg: string): void;
    error(msg: string): void;
    close(): void;
}
