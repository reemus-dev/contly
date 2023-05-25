import fs from "fs-extra";
import matterParse from "gray-matter";
import {CollectionFileShape, CollectionTypes} from "../../types.js";
import {getConfig} from "../config/config.js";
import {CollectionFileHeadings} from "./headings.js";

type Input = {
  type: CollectionTypes;
  filePath: string;
  fileName: string;
};

type Output<T> = T extends CollectionTypes ? CollectionFileShape<T> : never;

export const CollectionFile = {
  parse: async <A extends Input, T extends A["type"]>(args: A): Promise<Output<T>> => {
    const type = args.type;
    const {config} = await getConfig();
    const {filePath, fileName} = args;
    const {schema} = config.collections[type];
    const fileNameWithoutExt = fileName.replace(".mdx", "");
    const content = await fs.readFile(filePath, "utf8");
    const matter = matterParse(content);
    const meta = (await schema.parseAsync(matter.data)) as CollectionFileShape<T>["meta"];
    const slug = matter?.data?.slug || fileName;
    const headings = CollectionFileHeadings.extract(matter.content);
    const file = {name: fileName, path: filePath};
    const output: Output<CollectionTypes> = {type, slug, meta, matter, headings, file};
    return output as any;
  },
};
