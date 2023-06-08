import fs from "fs-extra";
import matterParse from "gray-matter";
import {fileNameInfo} from "../../lib/fs.js";
import {CollectionFileShape, CollectionTypes} from "../../types.js";
import {getConfig} from "../config/config.js";
import {CollectionFileHeadings} from "./headings.js";

type Input = {
  type: CollectionTypes;
  filePathAbs: string;
};

type Output<T> = T extends CollectionTypes ? CollectionFileShape<T> : never;

export const CollectionFile = {
  parse: async <A extends Input, T extends A["type"]>(args: A): Promise<Output<T>> => {
    const type = args.type;
    const filePathAbs = args.filePathAbs;

    const {config} = await getConfig();
    const {schema} = config.collections[type];

    const fileName = fileNameInfo(filePathAbs);
    const content = await fs.readFile(filePathAbs, "utf8");

    const matter = matterParse(content);
    const meta = (await schema.parseAsync(matter.data)) as CollectionFileShape<T>["meta"];
    const slug = matter?.data?.slug || fileName.base;
    const headings = CollectionFileHeadings.extract(matter.content);
    const file = {name: fileName, path: filePathAbs};

    const output: Output<CollectionTypes> = {type, slug, meta, matter, headings, file};
    return output as any;
  },
};
