import fs from "fs-extra";
import {globby} from "globby";
import path from "node:path";
import {pathResolve} from "../../lib/fs.js";
import {CollectionTypes} from "../../types.js";
import {getConfig} from "../config/config.js";
import {getWorkingDir} from "../config/paths.js";
import {CollectionFile} from "../file/index.js";

// const getDirectory = async <T extends Input>(params: T) => {
const getDirectory = async <T extends CollectionTypes>(type: T) => {
  const {paths, config} = await getConfig();
  const {contentPath} = config.collections[type];
  return path.resolve(paths.root, contentPath);
};

// const getFileNames = async <T extends Input>(params: T) => {
const getRelativeFilePaths = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const dir = await getDirectory(type);
  const filePaths = await globby("**/*.mdx", {
    cwd: dir,
    onlyFiles: true,
    absolute: false,
  });
  return {dir, filePaths};
};

// const getCollection = async <T extends Union.Strict<Input>>(params: T) => {
const all = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const {dir, filePaths} = await getRelativeFilePaths(type);
  return await Promise.all(
    filePaths.map(async (filePath) => {
      const filePathAbs = pathResolve(dir, filePath);
      return CollectionFile.parse({type, filePathAbs});
    })
  );
};

const slugs = async <T extends {type: CollectionTypes}>(params: T) => {
  const {type} = params;
  const files = await all<T["type"]>(type);
  const slugs = files.map((file) => file.slug);
  return {slugs};
};

const get = async <T extends {type: CollectionTypes; slug: string}>(params: T) => {
  const {type} = params;
  const files = await all<T["type"]>(type);
  const file = files.find((file) => file.slug === params.slug);
  return file || null;
};

export const Collection = {getDirectory, getRelativeFilePaths, all, get, slugs};
