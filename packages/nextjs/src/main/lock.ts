import exitHook from "exit-hook";
import lockfile from "proper-lockfile";
import {getConfig} from "@contly/core";

const lock = async () => {
  const {paths} = await getConfig();
  const filePath = paths.files.temp.lock;
  const options = {
    lockfilePath: paths.dirs.lock,
  };
  // Lockfile default options
  // stale: 10000,
  // update: 10000 / 2,
  // retries: 0,
  await lockfile.lock(filePath, options);
  exitHook(() => {
    lockfile.unlockSync(filePath, options);
  });
};

export const getProcessLock = async () => {
  try {
    await lock();
    return true;
  } catch {
    return false;
  }
};
