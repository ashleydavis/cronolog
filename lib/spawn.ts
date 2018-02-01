'use strict';

var child_process = require('child_process')
import { argv } from 'yargs';
import { ITaskLog } from './task-log';

//
// Execute a command wrapped in a promise.
// Pass in handlers for stdout/err.
//
export async function spawn(log: ITaskLog, copyOutput: boolean, cmd: string, args: string[], cwd?: string): Promise<string> {

    console.log('## ' + cmd + ' ' + args.join(' '));

	return new Promise<string>(function (resolve, reject) {
		var cp = child_process.spawn(cmd, args, {
            cwd: cwd
        });
		
		cp.stdout.on('data', data => {
			log.write(data.toString());

			if (copyOutput) {
				console.log(data.toString());
			}
		});

		cp.stderr.on('data', data => {
			log.error(data.toString());

			if (copyOutput) {
				console.error(data.toString());
			}
		});

		cp.on('error', function (code) {
			reject("Process errored with code " + code);
        });		
        
		cp.on('exit', function (code) {
			if (code !== 0) {
				reject(code);
				return;
			}

			resolve(); //TODO: might be cool if one task could use the output of the other.
		});		
	});
};
