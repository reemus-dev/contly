import lockfile from "proper-lockfile";
import {getConfig} from "@conte/core";

export const getProcessLock = async () => {
  const {paths} = await getConfig();
  try {
    await lockfile.lock(paths.files.temp.lock, {
      lockfilePath: paths.dirs.lock,
    });
    // Lockfile default options
    // stale: 10000,
    // update: 10000 / 2,
    // retries: 0,
    return true;
  } catch {
    return false;
  }
};
