# ICON TRANSFORMER

Clean up SVGs with one command. No compiling required, only pure Node.

## USAGE

- _THIS TOOL REQUIRES NODE 10.12+, PLEASE UPDATE YOUR VERSION_
- Install dependencies: `npm i`
- Config can be passed in as a command line argument, `icon-config.json` shows a basic layout for this
  - All `.svg` files in `config.input` directory will be transformed
  - After transformation, icons will be piped to `config.output` directory
  - `config.svgo` will be passed directly to [SVGO](https://github.com/svg/svgo)
  - Any icons with filename prefixes in `config.cleanPrefixes` will have those prefixes trimmed
- This tool can be used standalone by adjusting `icon-config.json` and using `npm start` or it can be integrated into other repos and a local config can be passed in the command line
- See `package.json` > scripts > start for command line usage
