import chokidar from "chokidar";
import * as esbuild from "esbuild";
import fs from "fs-extra";
import path from "node:path";

const isWatch = process.argv[2] === `--watch`;

const options = (entry, format) => {
  const extension = format === "cjs" ? "cjs" : "js";
  return {
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: format,
    outfile: `dist/conte-compat-${format}.${extension}`,
  };
};
const bundle = async (entry, format) => {
  await esbuild.build(options(entry, format));
};
const watch = async (entry, format) => {
  console.log(`esbuild: watching ${format} | ${entry}`);
  const ctx = await esbuild.context(options(entry, format));
  await ctx.watch();
};

const typesFile = path.resolve(process.cwd(), `dist/esm/index.d.ts`);
const typesFileDest = path.resolve(process.cwd(), `dist/conte-compat-esm.d.ts`);
const typesWrite = async () => {
  await fs.writeFile(typesFileDest, `export * from "./esm/index.js";`);
  // if (await fs.pathExists(typesFile)) {
  //   await fs.copy(typesFile, typesFileDest);
  // }
};
const typesWatch = async () => {
  chokidar.watch(typesFile).on("all", (event, path) => {
    typesWrite();
  });
};

if (isWatch) {
  await Promise.all([watch("src/cjs/index.ts", "cjs"), watch("src/esm/index.ts", "esm")]);
  await typesWrite();
} else {
  await Promise.all([
    bundle("src/cjs/index.ts", "cjs"),
    bundle("src/esm/index.ts", "esm"),
    typesWatch(),
  ]);
}

/*
 * Rename tsc commonjs build files from .js to .cjs
 */
/*
import chokidar from "chokidar";
import fs from "fs-extra";
import path from "node:path";
import {fileURLToPath} from "node:url";

const currentFileUrl = import.meta.url;
const currentFile = fileURLToPath(currentFileUrl);
const currentDir = path.dirname(currentFile);

const watchDir = path.resolve(currentDir, "dist/cjs");
const watchPattern = `${watchDir}/!**!/!*.js`;

const handleEvent = async (event, path) => {
  try {
    console.log(`[Build-Compat] Event: ${event} -> ${path}`);
    if (fs.pathExistsSync(path)) {
      const pathTo = `${path.slice(0, -3)}.cjs`;
      let content = await fs.readFile(path, "utf8");
      // const fixed = content.replace(/\.js"/g, `.cjs"`);

      const matches = Array.from(content.matchAll(/require\("(.*).js"\)/g));
      for (const match of matches) {
        const matchedString = match[0];
        const matchedImport = match[1];
        content = content.replace(matchedString, `require("${matchedImport}.cjs")`);
        /!*
        console.log({
          0: match[0],
          1: match[1],
          2: match[2],
        });
        *!/
      }

      await fs.writeFile(pathTo, content, "utf8");
      await fs.remove(path);
      // fs.move(path, pathTo, {overwrite: true});
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const watch = () => {
  chokidar.watch(watchPattern).on("all", (event, path) => {
    handleEvent(event, path);
  });
};

await watch();
*/
