import { build } from "esbuild";
import sparklePlugin from "esbuild-plugin-sparkle";
import fs from "fs";

//@ts-check
/** @typedef {import('esbuild').BuildOptions} BuildOptions **/

const PATTERNS_CSS = "./src/styles/patterns/patterns.css";
const ICONS_CSS = "./src/styles/icons/icons.css";

const PATTERN_FILES = [PATTERNS_CSS];
const ICON_FILES = [ICONS_CSS];

const OUT_DIR = "./functions";
const ENTRY_COMPONENTS_DIR = "./src/components";
const ENTRY_STYLES_DIR = "./src/styles";
const SCRIPT_SRC_DIR = "/_public/bundles";

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const componentsTS = fs
  .readdirSync(ENTRY_COMPONENTS_DIR)
  .map((name) => `${ENTRY_COMPONENTS_DIR}/${name}/${name}`)
  .map((p) => `${p}.ts`);
const stylesCSS = fs
  .readdirSync(ENTRY_STYLES_DIR)
  .map((name) => `${ENTRY_STYLES_DIR}/${name}/${name}.css`);

/** @type BuildOptions */
const mjsBundlesConfig = {
  bundle: true,
  format: "esm",
  target: "es2020",
  platform: "browser",
  outdir: `${OUT_DIR}`,
  outExtension: { ".js": ".mjs" },
  entryNames: "[name]",
};

// Build script
(async () => {
  try {
    console.log("build started");
    // Bundle component elements
    await build({
      ...mjsBundlesConfig,
      entryPoints: [...componentsTS],
      plugins: [
        sparklePlugin({
          patternFiles: PATTERN_FILES,
          iconFiles: ICON_FILES,
          scriptSrcDir: SCRIPT_SRC_DIR,
        }),
      ],
    });
    // Bundle style elements
    await build({
      ...mjsBundlesConfig,
      entryPoints: [...stylesCSS],
      plugins: [sparklePlugin()],
    });
    console.log("build finished");
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();
