"use strict";
//
// Simple logging system.
//
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var moment = require("moment");
var Log = /** @class */ (function () {
    function Log(taskName) {
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
    Log.prototype.write = function (msg) {
        this.stdout.write(msg);
    };
    //
    // Log an error
    //
    Log.prototype.error = function (msg) {
        this.stdout.write(msg);
        this.stderr.write(msg);
    };
    //
    // Close the output file stream.
    //
    Log.prototype.close = function () {
        this.stdout.end();
        this.stderr.end();
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map