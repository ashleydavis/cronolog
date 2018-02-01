"use strict";
//
// Simple logging system.
//
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var moment = require("moment");
var papaparse = require("papaparse");
var ScheduleLog = /** @class */ (function () {
    function ScheduleLog() {
        this.tasksInFlight = {};
        var outputPath = path.join(process.cwd(), "output");
        fs.ensureDirSync(outputPath);
        this.outputFilePath = path.join(outputPath, "cronolog.csv");
    }
    //
    // Log a task as started.
    //
    ScheduleLog.prototype.taskStarted = function (task) {
        this.tasksInFlight[task.name] = new Date();
    };
    ScheduleLog.prototype.writeCSV = function (task, result, errMsg) {
        var startTime = this.tasksInFlight[task.name];
        delete this.tasksInFlight[task.name];
        var endTime = new Date();
        var record = {
            Tsk: task.name,
            Start: moment(startTime).format("YYYY-MM-DD HH:SS"),
            End: moment(endTime).format("YYYY-MM-DD HH:SS"),
            Result: result,
            ErrMessage: errMsg || "no error",
        };
        var needsHeader = !fs.existsSync(this.outputFilePath);
        var csvRow = papaparse.unparse([record], { header: needsHeader });
        var csvOutput = fs.createWriteStream(this.outputFilePath, { flags: 'a' });
        csvOutput.write(csvRow + "\r\n");
        csvOutput.end();
    };
    //
    // Log a task as completed.
    //
    ScheduleLog.prototype.taskCompleted = function (task) {
        this.writeCSV(task, "success");
    };
    //
    // Log a task as errorred.
    //
    ScheduleLog.prototype.taskErrored = function (task, errMsg) {
        this.writeCSV(task, "error", errMsg);
    };
    return ScheduleLog;
}());
exports.ScheduleLog = ScheduleLog;
//# sourceMappingURL=schedule-log.js.map