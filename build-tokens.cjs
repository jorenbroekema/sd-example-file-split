const { readFileSync } = require("fs");
const StyleDictionary = require("style-dictionary");
const glob = require("glob");
const {
  registerTransforms,
  permutateThemes,
} = require("@tokens-studio/sd-transforms");

registerTransforms(StyleDictionary);

const $themes = JSON.parse(readFileSync("$themes.json", "utf-8"));
const themes = permutateThemes($themes, { seperator: "_" });
const configs = Object.entries(themes).map(([name, tokensets]) => {
  return {
    source: tokensets.map((tokenset) => `${tokenset}.json`),
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        prefix: "sd",
        buildPath: ``,
        files: tokensets.map((tokenset) => ({
          destination: `${tokenset}.css`,
          format: "css/variables",
          filter: (token) => token.filePath.split(".json")[0] === tokenset,
        })),
      },
    },
  };
});

configs.forEach((cfg) => {
  const sd = StyleDictionary.extend(cfg);
  sd.cleanAllPlatforms(); // optionally, cleanup files first..
  sd.buildAllPlatforms();
});
