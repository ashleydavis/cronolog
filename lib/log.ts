//
// Simple logging system.
//

import * as fs from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';

export interface ILog {

    //
    // Log a message out.
    //
    write (msg: string): void;

    //
    // Log an error
    //
    error (msg: string): void;
}

export class Log implements ILog {

    stdout: fs.WriteStream;
    stderr: fs.WriteStream;

    constructor (taskName: string) {
        const outputPath = path.join(process.cwd(), "output");
        fs.ensureDirSync(outputPath);

        const taskOutputPath = path.join(outputPath, taskName);
        fs.ensureDirSync(taskOutputPath);

        const dateOutputPath = path.join(taskOutputPath, moment().format('YYYY-MM-DD--HH-SS'));
        fs.ensureDirSync(dateOutputPath);

        this.stdout = fs.createWriteStream(path.join(dateOutputPath, "stdout.txt"));
        this.stderr = fs.createWriteStream(path.join(dateOutputPath, "stderr.txt"));
    }

    //
    // Log a message out.
    //    
    write (msg: string): void {
        this.stdout.write(msg);
    }

    //
    // Log an error
    //
    error (msg: string): void {
        this.stdout.write(msg);
        this.stderr.write(msg);
    }
    
    //
    // Close the output file stream.
    //
    close (): void {
        this.stdout.end();
        this.stderr.end();
    }
}