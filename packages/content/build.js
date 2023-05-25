import chokidar from "chokidar";
import fs from "fs-extra";
import path from "node:path";
import {fileURLToPath} from "node:url";

//  --preserveWatchOutput

export const currentFilePath = () => {
  const currentFileUrl = import.meta.url;
  return fileURLToPath(currentFileUrl);
};

export const currentDir = () => {
  return path.dirname(currentFilePath());
};

const __dirname = currentDir();

const config = [
  {
    from: "src/types-content.d.ts",
    to: "dist/types-content.d.ts",
  },
].map(({from, to}) => {
  return {
    from: path.resolve(__dirname, from),
    to: path.resolve(__dirname, to),
  };
});

const copy = async () => {
  for (const cfg of config) {
    try {
      const exists = await fs.pathExists(cfg.from);
      if (!exists) continue;
      const toDir = path.dirname(cfg.to);
      await fs.ensureDir(toDir);
      await fs.copy(cfg.from, cfg.to);
      // console.log("Copied", cfg);
    } catch (error) {
      console.error(e);
    }
  }
};

const watch = () => {
  const watchPaths = config.map((config) => config.from);
  chokidar.watch(watchPaths).on("all", async (event, path) => {
    console.log(`Path changed: ${event} -> ${path}`);
    await copy();
  });
};

await copy();
await watch();
