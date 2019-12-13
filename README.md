# Icon Transformer

Clean up SVGs with one command. No compiling required, only pure Node.

## Usage

- _THIS TOOL REQUIRES NODE 10.12+, PLEASE UPDATE YOUR VERSION_
- Install with NPM or Yarn `npm i -D icon-transformer`
- Can be used standalone or as a dependency of your project
  - Standalone: `npm start`; as a dependency: `node icon-transformer {path-to-icon-config.json}`
- Config can be passed in as a command line argument, `icon-config.json` shows a basic layout for this
  - All `.svg` files in `config.input` directory will be transformed
  - After transformation, icons will be piped to `config.output` directory
  - `config.svgo` will be passed directly to [SVGO](https://github.com/svg/svgo)
  - Any icons with filename prefixes in `config.cleanPrefixes` will have those prefixes trimmed
- This tool can be used standalone by adjusting `icon-config.json` and using `npm start` or it can be integrated into other repos and a local config can be passed in the command line

## Features

- Collapses and bakes transforms into paths (Sketch seems to export SVGs with a bunch of messy transform data that other SVG optimisers don't seem to fix)
- Converts `<use>` tags into their source tags.
- Can change extensions if your SVGs should be directly included (Shopify .liquid for instance)
- Can convert SVG attributes into classes for a more centralised CSS control of attributes like fill and stroke.
