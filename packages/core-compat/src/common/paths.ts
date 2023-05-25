import {dirname} from "node:path";
import path from "node:path";
import {callsites} from "./callsites.js";

export const normalizePath = (p: string) => {
  return path.normalize(p).replace(/\\/g, "/");
};

export const currentFilename = (): string => {
  const sites = callsites();
  const fileURLs = sites
    .map((stack) => stack.getFileName())
    .filter((name): name is string => !!name)
    .map((name) => name.replace("file:///", ""))
    .map((name) => normalizePath(name))
    .filter((name) => !name.includes("node:internal"))
    .filter((name) => !name.includes("node_modules"))
    // eslint-disable-next-line
    .filter((name) => !name.includes("dist/contly-compat-"));

  // console.log({fileURLs});

  const fileURL = fileURLs[0];

  if (!fileURL) {
    throw new Error(`Cannot find current filename`);
  }

  return fileURL;

  // const module = getModuleType();
  // return module === "cjs" ? fileURL : fileURLToPath(fileURL);
};

export const currentDirname = (): string => {
  const filename = currentFilename();
  return dirname(filename);
};
