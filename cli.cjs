var fs = require('fs')

var iconTransformer = require("./dist/main.js");
var defaultConfig = import("./icon-config.mjs");

const args = process.argv.slice(2);

const config =
  (args[0] && JSON.parse(fs.readFileSync(args[0], "utf8"))) || defaultConfig;

console.dir(iconTransformer)

iconTransformer.iconTransformer(config);