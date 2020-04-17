import fs from "fs";

import iconTransformer from "./index.mjs";
import defaultConfig from "./icon-config.json";

const args = process.argv.slice(2);

const config =
  (args[0] && JSON.parse(fs.readFileSync(args[0], "utf8"))) || defaultConfig;

iconTransformer(config);
