"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var index_1 = require("./index");
console.log("Loading cronolog.json from " + process.cwd());
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
try {
    cronolog.scheduleTasks();
}
catch (err) {
    console.error("Cronolog log failed.");
    console.error(err && err.stack || err);
    process.exit(1);
}
//# sourceMappingURL=cli.js.map