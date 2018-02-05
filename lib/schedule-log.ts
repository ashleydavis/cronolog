//
// Simple logging system.
//

import * as fs from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';
import { ICronologTask } from '../index';
import * as papaparse from 'papaparse';

export interface IScheduleLog {

    //
    // Log a task as started.
    //
    taskStarted (task: ICronologTask): void;

    //
    // Log a task as completed.
    //
    taskCompleted (task: ICronologTask): void;

    //
    // Log a task as errorred.
    //
    taskErrored (task: ICronologTask, errMsg: string): void;
}

export class ScheduleLog implements IScheduleLog {

    outputFilePath: string;

    constructor () {
        const outputPath = path.join(process.cwd(), "output");
        fs.ensureDirSync(outputPath);

        this.outputFilePath = path.join(outputPath, "cronolog.csv");
    }

    tasksInFlight: any = {};

    //
    // Log a task as started.
    //
    taskStarted (task: ICronologTask): void {
        this.tasksInFlight[task.name] = new Date();
    }

    private writeCSV (task: ICronologTask, result: string, errMsg?: string) {
        const startTime = this.tasksInFlight[task.name];
        delete this.tasksInFlight[task.name];

        const endTime = new Date();

        const record = {
            Tsk: task.name,
            Start: moment(startTime).format("YYYY-MM-DD HH:SS"),
            End: moment(endTime).format("YYYY-MM-DD HH:SS"),
            Result: result,
            Message: errMsg || "no error",
        };

        const needsHeader = !fs.existsSync(this.outputFilePath);
        const csvRow = papaparse.unparse([record], { header: needsHeader });

        const csvOutput = fs.createWriteStream(this.outputFilePath, { flags: 'a' });
        csvOutput.write(csvRow + "\r\n");
        csvOutput.end();
    }

    //
    // Log a task as completed.
    //
    taskCompleted (task: ICronologTask): void {
        this.writeCSV(task, "success");
    }

    //
    // Log a task as errorred.
    //
    taskErrored (task: ICronologTask, errMsg: string): void {
        this.writeCSV(task, "error", errMsg);
    }
}