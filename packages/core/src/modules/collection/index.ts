import fs from "fs-extra";
import path from "node:path";
import {pathResolve} from "../../lib/utils.js";
import {CollectionTypes} from "../../types.js";
import {getConfig} from "../config/config.js";
import {CollectionFile} from "../file/index.js";

// const getDirectory = async <T extends Input>(params: T) => {
const getDirectory = async <T extends CollectionTypes>(type: T) => {
  const {paths, config} = await getConfig();
  const {contentPath} = config.collections[type];
  return path.resolve(paths.root, contentPath);
};

// const getFileNames = async <T extends Input>(params: T) => {
const getFileNames = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const dir = await getDirectory(type);
  const fileNames = await fs.readdir(dir);
  return {dir, fileNames};
};

// const getCollection = async <T extends Union.Strict<Input>>(params: T) => {
const all = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const {dir, fileNames} = await getFileNames(type);
  return await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = pathResolve(dir, fileName);
      return CollectionFile.parse({type, filePath, fileName});
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

export const Collection = {getDirectory, getFileNames, all, get, slugs};
