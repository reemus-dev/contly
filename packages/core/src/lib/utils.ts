import fs from "fs-extra";
import crypto from "node:crypto";
import path from "node:path";
import {normalizePath} from "@contly/core-compat";

const _AsyncFunction = async () => {};
export const AsyncFunction = Object.getPrototypeOf(_AsyncFunction).constructor;

export const pathResolve = (...args: string[]) => {
  return normalizePath(path.resolve(...args));
};

export const fileRead = async (filePath: string) => {
  return await fs.readFile(filePath, "utf8");
};

export const fileWrite = async (filePath: string, body: string) => {
  return await fs.writeFile(filePath, body, "utf8");
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

export const jsonStringifyBase64 = (data: unknown) => {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};

export const jsonParseBase64 = <T>(data: string) => {
  const deserialized = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(deserialized) as T;
};

export const writeStdout = (data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stdout.write(data, (err) => {
      return err ? reject(err) : resolve();
    });
  });
};

export const writeStderr = (data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stderr.write(data, (err) => {
      return err ? reject(err) : resolve();
    });
  });
};

export const randomId = (size: number) => {
  const buffer = crypto.randomBytes(Math.ceil(size / 2));
  return buffer.toString("hex");
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

export const sleep = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
