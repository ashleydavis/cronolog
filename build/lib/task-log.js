"use strict";
//
// Simple logging system.
//
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var moment = require("moment");
var TaskLog = /** @class */ (function () {
    function TaskLog(taskName) {
        var outputPath = path.join(process.cwd(), "output");
        fs.ensureDirSync(outputPath);
        var taskOutputPath = path.join(outputPath, taskName);
        fs.ensureDirSync(taskOutputPath);
        var dateOutputPath = path.join(taskOutputPath, moment().format('YYYY-MM-DD--HH-SS'));
        fs.ensureDirSync(dateOutputPath);
        this.stdout = fs.createWriteStream(path.join(dateOutputPath, "stdout.txt"));
        this.stderr = fs.createWriteStream(path.join(dateOutputPath, "stderr.txt"));
    }
    //
    // Log a message out.
    //    
    TaskLog.prototype.write = function (msg) {
        this.stdout.write(msg);
    };
    //
    // Log an error
    //
    TaskLog.prototype.error = function (msg) {
        this.stdout.write(msg);
        this.stderr.write(msg);
    };
    //
    // Close the output file stream.
    //
    TaskLog.prototype.close = function () {
        this.stdout.end();
        this.stderr.end();
    };
    return TaskLog;
}());
exports.TaskLog = TaskLog;
//# sourceMappingURL=task-log.js.map