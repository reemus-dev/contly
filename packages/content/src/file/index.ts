import fs from "fs-extra";
import matter from "gray-matter";
import {CollectionFile, CollectionTypes} from "../types.js";
import {FileComponent} from "./component.js";
import {FileHeadings} from "./headings.js";

type Input = {
  type: CollectionTypes;
  filePath: string;
  fileName: string;
};

type Output<T> = T extends CollectionTypes ? CollectionFile<T> : never;

export const File = {
  parse: async <A extends Input, T extends A["type"]>(args: A): Promise<Output<T>> => {
    const {type, filePath, fileName} = args;
    const fileNameWithoutExt = fileName.replace(".mdx", "");
    const content = await fs.readFile(filePath, "utf8");
    const parsed = matter(content);
    // const data = await CollectionSchema[type].parseAsync(parsed.data);
    // const slug = data.slug;
    // const headings = FileHeadings.extract(parsed.content);

    // const file = {...parsed, type, headings, fileName, filePath, slug, data};
    // await FileComponent.create(file);

    // const componentType = data.client ? "client" : "server";

    // await ContentFileComponent.create(type, componentType, fileNameWithoutExt);

    // const importPath = `${type}/_components/${fileNameWithoutExt}.tsx`;
    // const {default: Component} = await import(`@/content/${importPath}`);

    return {} as any;
  },
};
