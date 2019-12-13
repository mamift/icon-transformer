import fs from "fs";
import path from "path";

import cheerio from "cheerio";
import SVGO from "svgo";

import bakeTransforms from "./bakeTransforms";
import classifySVGAttrs from "./classifySVGAttrs";
import flattenUseTags from "./flattenUseTags";

export default function processFolder(folder, config, outputSubfolder = null) {
  const svgo = new SVGO(config.svgo);

  if (outputSubfolder) {
    fs.mkdirSync(path.resolve(`${config.output}/${outputSubfolder}`), {
      recursive: true
    });
  }

  // FIXME: this is ugly
  return new Promise(r => {
    fs.readdir(folder, (e, fileNames) => {
      r(
        fileNames &&
          fileNames.map(
            async fileName =>
              new Promise((resolve, reject) => {
                // Descend into subfolders and run again
                if (
                  fs
                    .lstatSync(path.resolve(`${folder}/${fileName}`))
                    .isDirectory()
                ) {
                  // FIXME: Total processed number is based on number of Promises returned, but this returns one Promise for potentially many files if subfolders are used.
                  return processFolder(
                    `${folder}/${fileName}`,
                    config,
                    fileName
                  ).catch(e => reject(e));
                }
                if (!fileName.match(/\.svg$/)) {
                  return reject(
                    `${fileName} was not processed, please supply only .svg files`
                  );
                }

                fs.readFile(
                  path.resolve(`${folder}/${fileName}`),
                  "utf8",
                  async (err, icon) => {
                    const $ = cheerio.load(icon);

                    // TURN USE[HREF] INTO REAL ELEMENTS
                    await flattenUseTags($);

                    // BAKE TRANSFORMS
                    if (
                      config.bakeTransforms === undefined ||
                      config.bakeTransforms === true
                    ) {
                      await bakeTransforms($);
                    }

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
                    let outName = fileName
                      .toLowerCase()
                      .replace(" ", "-")
                      .replace(
                        /\.svg$/,
                        config.outputExtension ? config.outputExtension : ".svg"
                      );
                    config.cleanPrefixes.forEach(prefix => {
                      outName = outName.replace(new RegExp(`^${prefix}`), "");
                    });

                    // WRITE TO FILE
                    fs.writeFile(
                      path.resolve(
                        `${config.output}/${
                          outputSubfolder ? outputSubfolder + "/" : ""
                        }${outName}`
                      ),
                      out,
                      () => resolve(`Saved ${outName}`)
                    ).catch(e => {
                      // FIXME: all of these FS operations should probably have a catch/reject
                      console.warn(e);
                    });
                  }
                );
              })
          )
      );
    });
  });
}
