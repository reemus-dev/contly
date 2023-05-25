import fs from "fs-extra";
import path from "node:path";
import {File} from "../file/index.js";
import {CollectionTypes} from "../types.js";

const getConfig = async () => {
  const cwd = process.cwd();
  const fileName = `frontmatter.json`;
  const filePath = path.resolve(cwd, fileName);
  const fileContent = await fs.readFile(filePath, "utf8");
  const fileJson = JSON.parse(fileContent);
  return fileJson as any;
};

// const getDirectory = async <T extends Input>(params: T) => {
const getDirectory = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const cwd = process.cwd();
  const config = await getConfig();
  const meta = config["frontMatter.content.pageFolders"].find((item: any) => item.title === type);
  return path.resolve(cwd, meta?.path.replace("[[workspace]]/", "") || "");
};

// const getFileNames = async <T extends Input>(params: T) => {
const getFileNames = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const dir = await getDirectory(type);
  const fileNames = await fs.readdir(dir);
  return {dir, fileNames};
};

// const getCollection = async <T extends Union.Strict<Input>>(params: T) => {
const getCollection = async <T extends CollectionTypes>(type: T) => {
  // const {type} = params;
  const {dir, fileNames} = await getFileNames(type);
  const files = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.resolve(dir, fileName);
      return File.parse({type, filePath, fileName});
    })
  );
  return {dir, fileNames, files};
};

export const Collection = {
  slugs: async <T extends {type: CollectionTypes}>(params: T) => {
    const {type} = params;
    const {dir, files} = await getCollection<T["type"]>(type);
    const slugs = files.map((file) => file.slug);
    return {dir, slugs};
  },
  get: async <T extends {type: CollectionTypes; slug: string}>(params: T) => {
    const {type} = params;
    const {files} = await getCollection<T["type"]>(type);
    const file = files.find((file) => file.slug === params.slug);
    return file || null;
  },
};
