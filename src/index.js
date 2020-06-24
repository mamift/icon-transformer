/* eslint-disable no-shadow, consistent-return */
import fs from "fs";
import path from "path";

import processFolder from "./functions/processFolder.mjs";

export default async function(cfg) {
  console.time("Icon processing complete");

  // CREATE DIRECTORY FOR ICONS IF IT DOESN'T EXIST
  fs.mkdirSync(path.resolve(cfg.output), { recursive: true });
  console.log(cfg.output, path.resolve(cfg.output));
  const promises = await processFolder(cfg.input, cfg);
  let numErrors = 0;

  await Promise.all(
    promises.map(p => {
      p.catch(error => {
        console.warn("\x1b[33m%s\x1b[0m", `⚠️  Notice: ${error}`);
        numErrors += 1;
      });
    })
  );

  if (numErrors > 0) {
    // Just for an empty line
    console.log();
  }

  console.log(`${promises.length - numErrors} files processed`);
  console.timeEnd("Icon processing complete");

  return numErrors;
}
