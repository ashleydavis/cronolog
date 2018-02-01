"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var index_1 = require("./index");
var userConfig = require(path.join(process.cwd(), 'cronolog.json'));
var tasks = [];
for (var _i = 0, _a = Object.keys(userConfig); _i < _a.length; _i++) {
    var taskName = _a[_i];
    var task = userConfig[taskName];
    task.name = taskName;
    tasks.push(task); //TODO: want better error checking here.
}
var config = {
    tasks: tasks,
};
var cronolog = new index_1.Cronolog(config);
cronolog.scheduleTasks();
//# sourceMappingURL=cli.js.map