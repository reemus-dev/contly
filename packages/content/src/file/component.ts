import fs from "fs-extra";
// import {CollectionTypes} from "mdxn:content";
import path from "node:path";
import {CollectionFile, CollectionTypes} from "../types.js";

export const FileComponent = {
  create: async <K extends CollectionTypes>(file: CollectionFile<K>) => {
    const cwd = process.cwd();

    const outputDir = path.resolve(cwd, `app`, file.type, file.slug);
    const outputPath = path.resolve(outputDir, `page.tsx`);
    const outputContent = `
import React from "react";
import {BlogPage} from "@/components/pages/BlogPage/BlogPage";

export default async function Page() {
  const {default: Content} = await import("@/content/${file.type}/${file.file.name}");
  return (
    <BlogPage slug="${file.slug}">
      <Content />
    </BlogPage>
  );
}
`;

    if (await fs.exists(outputPath)) {
      const existingContent = await fs.readFile(outputPath, "utf8");
      if (existingContent === outputContent) {
        return;
      }
    }

    // await fs.ensureDir(outputDir);
    // await fs.writeFile(outputPath, outputContent);
  },
};
