#!/usr/bin/env node
const { spawn } = require('child_process');

// Compose command line
const args = ['truffle', 'exec', './scripts/tools/cli.js'];
Array.prototype.push.apply(args, process.argv.slice(2));

if (!args.includes('--network')) {
    throw new Error('"--network" parameter is required');
}

const cmd = spawn('npx', args);

cmd.stdout.on('data', data => {
    console.log(data.toString().replace(/[\n\r]$/, ''));
});

cmd.stderr.on('data', data => {
    console.error(data.toString().replace(/[\n\r]$/, ''));
});

cmd.on('close', code => {
    process.exit(code);
});

cmd.on('error', function (err) {
    throw err;
});
