import bakeTransforms from "./functions/bakeTransforms";

import classifySVGFills from "./functions/classifySVGFills";

import fs from "fs";


import config from './.env';

import cheerio from 'cheerio';


fs.readFile('./user.svg', "utf8", (err, icon) => {
  const $ = cheerio.load(icon, {
    xmlMode: true
  });
  bakeTransforms($)
    .then(
      $ => classifySVGFills($)
        .then($ => console.log($('svg').html()))
    );
  // console.log(out);
})
