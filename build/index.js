"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var spawn_1 = require("./lib/spawn");
var task_log_1 = require("./lib/task-log");
var schedule_log_1 = require("./lib/schedule-log");
var cron = require('node-cron');
var prettyCron = require('prettycron');
//
// Helper function to map an array of objects.
//
function toMap(items, keySelector, valueSelector) {
    var output = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var key = keySelector(item);
        output[key] = valueSelector(item);
    }
    return output;
}
;
//
// The Cronolog task scheduler.
//
var Cronolog = /** @class */ (function () {
    function Cronolog(config) {
        this.scheduleLog = new schedule_log_1.ScheduleLog();
        chai_1.assert.isObject(config, "Invalid config object passed to Cronolog constructor.");
        this.config = config;
    }
    //
    // Log events as they occur.
    //
    Cronolog.prototype.log = function (msg) {
        // Built on promises for future compatibility.
        console.log(msg);
    };
    //
    // Reports that a task has started.
    //
    Cronolog.prototype.taskStarted = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Built on promises for future compatibility.
                this.log("Task " + task.name + " has started.");
                this.scheduleLog.taskStarted(task);
                return [2 /*return*/];
            });
        });
    };
    //
    // Reports that a task has completed.
    //
    Cronolog.prototype.taskComplete = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Built on promises for future compatibility.
                //todo: write to log file.
                this.log("Task " + task.name + " has completed with no error."); //TODO: include the datetime it endeed. Include the duration of the task.
                this.scheduleLog.taskCompleted(task);
                return [2 /*return*/];
            });
        });
    };
    //
    // Reports that a task has errored.
    //
    Cronolog.prototype.taskErrored = function (task, err) {
        return __awaiter(this, void 0, void 0, function () {
            var errMsg;
            return __generator(this, function (_a) {
                errMsg = "";
                if (err.stack) {
                    errMsg = err.stack.toString();
                }
                else {
                    errMsg = err.toString();
                }
                //TODO: include the datetime it errored. Include the duration of the task.
                this.log("Task " + task.name + " has errorred.\n" + errMsg);
                this.scheduleLog.taskErrored(task, errMsg);
                return [2 /*return*/];
            });
        });
    };
    //
    // Run the tasks that another task is dependant on.
    //
    Cronolog.prototype.runTaskDependees = function (task, taskMap) {
        return __awaiter(this, void 0, void 0, function () {
            var dependee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!task.dependsOn) return [3 /*break*/, 2];
                        dependee = taskMap[task.dependsOn];
                        if (!dependee) {
                            throw new Error("Failed to find task " + task.dependsOn + " that is depended upon by task " + task.name);
                        }
                        return [4 /*yield*/, this.runTask(dependee, taskMap)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    //
    // Run a task immediately.
    // Runs asyncronously and resolves when the task has completed (or has errorred)
    //
    Cronolog.prototype.runTask = function (task, taskMap) {
        return __awaiter(this, void 0, void 0, function () {
            var log, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //
                    // First run the tasks we are dependent on.
                    //
                    return [4 /*yield*/, this.runTaskDependees(task, taskMap)];
                    case 1:
                        //
                        // First run the tasks we are dependent on.
                        //
                        _a.sent();
                        return [4 /*yield*/, this.taskStarted(task)];
                    case 2:
                        _a.sent();
                        log = new task_log_1.TaskLog(task.name);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, 8, 9]);
                        return [4 /*yield*/, spawn_1.spawn(log, task.cmd.exe, task.cmd.args || [], task.cmd.cwd)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.taskComplete(task)];
                    case 5:
                        _a.sent();
                        if (task.when) {
                            this.log(task.name + " will next run: " + prettyCron.getNext(task.when));
                        }
                        return [3 /*break*/, 9];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.taskErrored(task, err_1)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        log.close();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //
    // Schedule all tasks for execution.
    //
    Cronolog.prototype.scheduleTasks = function () {
        var _this = this;
        var taskMap = toMap(this.config.tasks, function (task) { return task.name; }, function (task) { return task; });
        var scheduledTasks = this.config.tasks.filter(function (task) { return task.when; });
        if (scheduledTasks.length === 0) {
            throw new Error("Found no scheduled tasks.");
        }
        var _loop_1 = function (task) {
            this_1.log("Starting task " + task.name);
            this_1.log("Cron schedule: " + task.when);
            this_1.log("Frequency:     " + prettyCron.toString(task.when));
            this_1.log("Next:          " + prettyCron.getNext(task.when));
            cron.schedule(task.when, function () {
                _this.runTask(task, taskMap)
                    .catch(function (err) {
                    console.error("Unhandled exception while running task " + task.name);
                    console.error(err.stack || err);
                });
            });
        };
        var this_1 = this;
        for (var _i = 0, scheduledTasks_1 = scheduledTasks; _i < scheduledTasks_1.length; _i++) {
            var task = scheduledTasks_1[_i];
            _loop_1(task);
        }
    };
    ;
    return Cronolog;
}());
exports.Cronolog = Cronolog;
//# sourceMappingURL=index.js.map