import fs from "fs-extra";
import {consts} from "../../consts.js";
import {pathResolve} from "../../lib/fs.js";

export const getWorkingDir = async () => {
  const cwd = process.cwd();
  const files = await fs.readdir(cwd);
  if (!files.includes(`package.json`)) {
    throw new Error(`Paths: Invalid CWD - ${cwd}`);
  }
  return cwd;
};

export const getPaths = async (params?: {cwd?: string}) => {
  const root = pathResolve(params?.cwd || (await getWorkingDir()));
  const temp = pathResolve(root, consts.TEMP_DIR);
  const dirs = {temp, lock: pathResolve(temp, `lock`)};

  const files = {
    temp: {
      lock: pathResolve(temp, `.lock`),
      types: pathResolve(temp, `types.d.ts`),
      outputs: pathResolve(temp, `outputs.json`),
    },
    config: {
      js: pathResolve(root, `${consts.CONFIG_FILE_NAME}.js`),
      mjs: pathResolve(root, `${consts.CONFIG_FILE_NAME}.mjs`),
      cjs: pathResolve(root, `${consts.CONFIG_FILE_NAME}.cjs`),
    },
    next: {
      config: pathResolve(root, `next.config.js`),
      env: pathResolve(root, `next-env.d.ts`),
    },
  };

  // await fs.ensureDir(dirs.temp);
  // await fs.ensureFile(files.lock);

  return {root, dirs, files};
};

export type ConfigPaths = Awaited<ReturnType<typeof getPaths>>;
