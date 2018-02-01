'use strict';

var child_process = require('child_process')
import { argv } from 'yargs';

//
// Execute a command wrapped in a promise.
// Pass in handlers for stdout/err.
//
export async function spawn(cmd: string, args: string[], cwd?: string): Promise<string> {

    console.log('## ' + cmd + ' ' + args.join(' '));

    var output = "";

	return new Promise<string>(function (resolve, reject) {
		var cp = child_process.spawn(cmd, args, {
            cwd: cwd
        });
		
		cp.stdout.on('data', data => {
            var s = data.toString();
            output += s;
			console.log(s);
		});

		cp.stderr.on('data', data => {
			console.error(data.toString());
		});

		cp.on('error', function (code) {
			reject("Process errored");
        });		
        
		cp.on('exit', function (code) {
			if (code !== 0) {
				reject(code);
				return;
			}

			resolve(output);
		});		
	});
};
