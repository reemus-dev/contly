#!/usr/bin/env node
import exitHook from "exit-hook";
import fs from "fs-extra";
import child from "node:child_process";
import os from "node:os";
import {pathResolve} from "@contly/core";

const getNextBin = async (cwd: string) => {
  let binPath = pathResolve(cwd, `node_modules/.bin/next`);

  if (os.platform() === "win32") {
    binPath += ".cmd";
    if (!(await fs.pathExists(binPath))) {
      binPath = binPath.replace(/\.cmd$/, ".CMD");
    }
  }

  return {
    exists: await fs.pathExists(binPath),
    path: binPath,
  };
};

export const spawnNext = async (params: {cwd: string; args: string[]}): Promise<void> => {
  const {cwd, args} = params;
  const bin = await getNextBin(cwd);

  if (!bin.exists) {
    throw new Error(`Next.js bin script not found:\n${bin.path}`);
  }

  return new Promise((resolve, reject) => {
    const proc = child.spawn(bin.path, args, {cwd, stdio: "inherit"});

    exitHook(() => proc.kill(9));

    proc.on("error", (err) => {
      console.error(`Next.js error:`, err);
    });
    proc.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Next.js process exited with code ${code}`));
      }
    });
  });
};
