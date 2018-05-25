import * as path from 'path';
import { Cronolog, ICronologConfig, ICronologTask, ICronologCommand } from './index';

console.log("Loading cronolog.json from " + process.cwd());

const userConfig = require(path.join(process.cwd(), 'cronolog.json'));

const tasks: ICronologTask[] = [];

for (const taskName of Object.keys(userConfig)) {

    const task: ICronologTask = userConfig[taskName];
    task.name = taskName;
    tasks.push(task); //TODO: want better error checking here.
}

const config: ICronologConfig = {
    tasks: tasks,
}

const cronolog = new Cronolog(config)
try {
    cronolog.scheduleTasks();
}
catch (err) {
    console.error("Cronolog log failed.");
    console.error(err && err.stack || err);
    process.exit(1);
}
