#!/usr/bin/env node
// https://github.com/nodejs/help/issues/1888
const path = require("path");
const { spawn } = require("child_process");

const FLAGS = ["--experimental-modules", "--no-warnings"];
const EXEC_FILE = path.join(__dirname, "cli.mjs");

const options = [...FLAGS, EXEC_FILE, ...process.argv.slice(2)];
const subprocess = spawn(process.argv0, options, {
  windowsHide: true
});

// if your server subprocess crashes
subprocess.on("error", err => console.error(err));

subprocess.stderr.pipe(process.stderr);
subprocess.stdout.pipe(process.stdout);
