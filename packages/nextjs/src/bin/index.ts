#!/usr/bin/env node
import fs from "fs-extra";
import {getConfig, processExit} from "@contly/core";
import {getProcessLock} from "../main/lock.js";
import {outputPages, outputPagesWatch} from "../main/outputs/generate-pages.js";
import {outputTypes} from "../main/outputs/generate-types.js";
import {spawnNext} from "../main/spawn-next.js";

const cwd = process.cwd();

async function main() {
  if (process.argv.length === 0) throw new Error(`No arguments provided`);
  const args = process.argv.slice(2);
  const command = args[0];

  if (command !== "dev" && command !== "build") {
    throw new Error(`Invalid next.js command (${command}), only supports dev and build`);
  }

  const {paths} = await getConfig({cwd});

  // Need to do this prior to locking
  await fs.ensureDir(paths.dirs.temp);
  await fs.ensureFile(paths.files.temp.lock);

  const locked = await getProcessLock();
  if (!locked) {
    console.log("Locked");
    return;
  }

  // console.dir({paths, config}, {depth: null});

  await outputTypes({});
  await outputPages({});

  // eslint-disable-next-line unicorn/prefer-ternary
  if (command === "build") {
    // When building for production
    await spawnNext({cwd, args});
  } else {
    // When running in development
    await Promise.all([outputPagesWatch(), spawnNext({cwd, args})]);
  }
}

main().catch((e) => {
  processExit(true, e);
});
