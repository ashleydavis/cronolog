/// <reference types="node" />
import * as fs from 'fs-extra';
export interface ITaskLog {
    write(msg: string): void;
    error(msg: string): void;
}
export declare class TaskLog implements ITaskLog {
    stdout: fs.WriteStream;
    stderr: fs.WriteStream;
    constructor(taskName: string);
    write(msg: string): void;
    error(msg: string): void;
    close(): void;
}
