import * as path from 'path';
import { Cronolog, ICronologConfig, ICronologTask, ICronologCommand } from './index';

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
cronolog.scheduleTasks();