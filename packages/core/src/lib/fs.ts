import fs from "fs-extra";
import path from "node:path";
import {normalizePath} from "@contly/core-compat";
import {FileNameInfo} from "../types.js";

export const pathResolve = (...args: string[]) => {
  return normalizePath(path.resolve(...args));
};

export const fileRead = async (filePath: string) => {
  return await fs.readFile(filePath, "utf8");
};

export const fileWrite = async (filePath: string, body: string) => {
  return await fs.writeFile(filePath, body, "utf8");
};

export const fileNameInfo = (filePath: string): FileNameInfo => {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const full = path.basename(filePath);
  return {ext, base, full};
};

export const pathExistsMulti = async (paths: string[]) => {
  for (const p of paths) {
    if (await fs.pathExists(p)) {
      return p;
    }
  }
  return null;
};

export const getPackageRoot = async (fsPath: string): Promise<string> => {
  const stat = await fs.stat(fsPath);
  if (stat.isDirectory()) {
    const files = await fs.readdir(fsPath);
    if (files.includes("package.json")) {
      return fsPath;
    }
  }
  return await getPackageRoot(path.dirname(fsPath));
};

export const fileReadFirstLine = (filePath: string) =>
  new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, {encoding: "utf8"});

    let firstLine = "";
    let foundLineEnd = false;

    readStream.on("data", (chunk) => {
      const data = Buffer.isBuffer(chunk) ? chunk.toString("utf-8") : chunk;
      if (foundLineEnd) {
        readStream.destroy();
        return;
      }

      const lines = data.split(/\r?\n/);
      firstLine += lines[0];

      if (lines.length > 1) {
        foundLineEnd = true;
        readStream.destroy();
      }
    });

    readStream.on("close", () => {
      resolve(firstLine);
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
