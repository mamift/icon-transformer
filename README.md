# Icon Transformer

Clean up SVGs with one command. No compiling required, only pure Node.

## Usage

- _THIS TOOL REQUIRES NODE 10.12+, PLEASE UPDATE YOUR VERSION_
- Install with NPM or Yarn `npm i -D icon-transformer`
- Can be used standalone, as a dependency of your project or within other Node scripts
  - Standalone: `npm start`
  - As an NPM script: `icon-transformer {path-to-icon-config.json}`
  - Within other scripts: `import iconTransformer from "icon-transformer";`
- Config can be passed in as a command line argument, `icon-config.json` shows a basic layout for this
  - All `.svg` files in `config.input` directory will be transformed
  - After transformation, icons will be piped to `config.output` directory
  - `config.svgo` will be passed directly to [SVGO](https://github.com/svg/svgo)
  - Any icons with filename prefixes in `config.cleanPrefixes` will have those prefixes trimmed
- This tool can be used standalone by adjusting `icon-config.json` and using `npm start` or it can be integrated into other repos and a local config can be passed in the command line

## Example usage in scripts

```
import iconTransformer from "icon-transformer";
import iconConfig from "./icon-config";

iconTransformer(iconConfig).then(errors => {
  console.log("Icons Processed");
});
```

## Features

- Collapses and bakes transforms into paths (Sketch seems to export SVGs with a bunch of messy transform data that other SVG optimisers don't seem to fix)
- Converts `<use>` tags into their source tags.
- Can change extensions if your SVGs should be directly included (Shopify .liquid for instance)
- Can convert SVG attributes into classes for a more centralised CSS control of attributes like fill and stroke.
