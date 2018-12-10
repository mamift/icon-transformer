import fs from "fs";
import path from "path";

import cheerio from "cheerio";
import SVGO from "svgo";

// import config from "./icon-config";

import bakeTransforms from "./functions/bakeTransforms";
import classifySVGFills from "./functions/classifySVGFills";

console.time("Transform icons");

const args = process.argv.slice(2);

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), args[0]), "utf8")
);

const svgo = new SVGO(config.svgo);

console.log(config);

// FIND ALL IN INPUT DIRECTORY
fs.readdir(config.input, (e, fileNames) => {
  fileNames.forEach(async fileName => {
    if (!fileName.match(/\.svg$/)) {
      console.log(
        `${fileName} was not processed, please supply only .svg files`
      );
      return;
    }
    // READ EACH FILE
    fs.readFile(`./${config.input}/${fileName}`, "utf8", async (err, icon) => {
      const $ = cheerio.load(icon);

      // SVGO
      const optimised = await svgo
        .optimize($("body").html())
        .then(({ data }) => data);

      $("svg").replaceWith(optimised);

      // BAKE TRANSFORMS
      const out = await bakeTransforms($).then(
        // CLASSIFY FILLS
        $ => classifySVGFills($, config).then($ => $("body").html())
      );

      // REMOVE UNWANTED PREFIXES
      let outName = fileName;
      config.cleanPrefixes.forEach(prefix => {
        const re = new RegExp(`^${prefix}`);
        outName = outName.replace(re, "");
      });

      // WRITE TO FILE
      fs.writeFile(`./${config.output}/${outName}`, out, e => {
        if (e) {
          console.log(e);
        }
        console.log(`Saved ${outName}`);
      });
    });
  });
});
// console.timeEnd("Transform icons");
