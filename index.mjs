/* eslint-disable no-shadow, consistent-return */
import fs from "fs";
import path from "path";

import cheerio from "cheerio";
import SVGO from "svgo";

import bakeTransforms from "./functions/bakeTransforms";
import classifySVGAttrs from "./functions/classifySVGAttrs";
import flattenXlinks from "./functions/flattenXlinks";

console.time("Icon processing complete");

const args = process.argv.slice(2);

const config = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));

const svgo = new SVGO(config.svgo);

// CREATE DIRECTORY FOR ICONS IF IT DOESN'T EXIST
fs.mkdirSync(path.resolve(config.output), { recursive: true });

// FIND ALL IN INPUT DIRECTORY
fs.readdir(config.input, (e, fileNames) => {
  Promise.all(
    fileNames.map(
      async fileName =>
        new Promise(resolve => {
          if (!fileName.match(/\.svg$/)) {
            return resolve(
              `${fileName} was not processed, please supply only .svg files`
            );
          }
          fs.readFile(
            path.resolve(`${config.input}/${fileName}`),
            "utf8",
            async (err, icon) => {
              const $ = cheerio.load(icon);

              // TURN USE[XLINK:HREF] INTO REAL ELEMENTS
              await flattenXlinks($);
              // BAKE TRANSFORMS
              await bakeTransforms($);
              // CLEAN SPECIFIED ATTRIBUTES
              await classifySVGAttrs($, config);

              // SVGO
              const optimised = await svgo
                .optimize($("body").html())
                .then(({ data }) => data);
              $("svg").replaceWith(optimised);
              $("svg").addClass("icon");
              const out = $("body").html();

              // REMOVE FILE PREFIXES
              let outName = fileName.toLowerCase();
              config.cleanPrefixes.forEach(prefix => {
                outName = outName.replace(new RegExp(`^${prefix}`), "");
              });

              // WRITE TO FILE
              fs.writeFile(
                path.resolve(`${config.output}/${outName}`),
                out,
                () => resolve(`Saved ${outName}`)
              );
            }
          );
        })
    )
  ).then(() => {
    console.log(`${fileNames.length} files processed`);
    console.timeEnd("Icon processing complete");
  });
});
