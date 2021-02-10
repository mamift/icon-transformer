import fs from "fs"

import transformer from "./dist/main.js"
import defaultConfig from "./icon-config.mjs"

const args = process.argv.slice(2)

const config =
  (args[0] && JSON.parse(fs.readFileSync(args[0], "utf8"))) || defaultConfig

// console.dir(transformer)

transformer.iconTransformer(config)