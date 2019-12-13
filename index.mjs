/* eslint-disable no-shadow, consistent-return */
import fs from "fs";
import path from "path";

import processFolder from "./functions/processFolder";
import defaultConfig from "./icon-config.json";

console.time("Icon processing complete");

const args = process.argv.slice(2);

const config =
  (args[0] && JSON.parse(fs.readFileSync(args[0], "utf8"))) || defaultConfig;

// CREATE DIRECTORY FOR ICONS IF IT DOESN'T EXIST
fs.mkdirSync(path.resolve(config.output), { recursive: true });

let numErrors = 0;

processFolder(config.input, config).then(promises => {
  let numErrors = 0;
  Promise.all(
    promises.map(p => {
      p.catch(error => {
        console.warn("\x1b[33m%s\x1b[0m", `⚠️  Notice: ${error}`);
        numErrors += 1;
      });
    })
  ).then(() => {
    if (numErrors > 0) {
      // Just for an empty line
      console.log();
    }
    console.log(`${promises.length - numErrors} files processed`);
    console.timeEnd("Icon processing complete");
  });
});
