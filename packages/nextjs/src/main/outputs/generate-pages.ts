import chokidar from "chokidar";
import fs from "fs-extra";
import path from "node:path";
import prettier from "prettier";
import {
  Collection,
  CollectionFileShape,
  ConfigCollectionShape,
  createDebounceQueue,
  fileWrite,
  getConfig,
  pathResolve,
} from "@contly/core";
import {createScopedLoggers, logger} from "../../log.js";
import {outputsGet, outputsSave} from "./file.js";

const log = createScopedLoggers("OutputPages");

const collectionFilePath = (
  collection: ConfigCollectionShape<any>,
  file: CollectionFileShape<string>
) => {
  const outputDir = pathResolve(collection.outputPath, file.slug);
  const outputFile = pathResolve(outputDir, "page.tsx");
  return {outputDir, outputFile};
};

const collectionClean = async (type: string, files: CollectionFileShape<string>[]) => {
  const {config} = await getConfig();

  const outputs = await outputsGet();
  outputs.collections[type] ??= {files: []};
  const collection = config.collections[type];

  const outputFilesSaved = outputs.collections[type].files;
  const outputFiles = new Set(
    files.map((file) => {
      const {outputFile} = collectionFilePath(collection, file);
      return outputFile;
    })
  );

  const filesToRemove = outputFilesSaved.filter((file) => !outputFiles.has(file));

  for (const filePath of filesToRemove) {
    const dir = path.dirname(filePath);
    log.main("Collection clean", dir);
    if (await fs.exists(dir)) {
      await fs.rm(dir, {recursive: true});
    }
    outputs.collections[type].files = outputs.collections[type].files.filter(
      (file) => file !== filePath
    );
    await outputsSave(outputs);
    // outputsSave
  }
};

const collectionCreate = async (type: string, files: CollectionFileShape<string>[]) => {
  const {config, paths} = await getConfig();

  const outputs = await outputsGet();
  outputs.collections[type] ??= {files: []};

  const collection = config.collections[type];
  const component = collection.component;

  for (const file of files) {
    const contentImportPath = file.file.path.replace(paths.root, "@");
    const {outputDir, outputFile} = collectionFilePath(collection, file);

    const imports = collection.generateMetadata
      ? `import ContentWrapper, {createGenerateMetadata} from "${component}";`
      : `import ContentWrapper from "${component}";`;

    const metadata = collection.generateMetadata
      ? `\nconst generateMetadata = createGenerateMetadata({ type: "${type}", slug: "${file.slug}" });`
      : ``;

    const exports = collection.generateMetadata ? `export {generateMetadata};` : ``;

    const outputContent = `
        import React from "react";
        ${imports}
        ${metadata}
        
        export default async function Page() {
          const {default: Content} = await import("${contentImportPath}");
          return (
            <ContentWrapper type="${type}" slug="${file.slug}">
              <Content />
            </ContentWrapper>
          );
        }
        
        ${exports}
      `;
    const outputFormatted = prettier.format(outputContent, {parser: "typescript"});
    await fs.ensureDir(outputDir);
    await fileWrite(outputFile, outputFormatted);

    if (!outputs.collections[type].files.includes(outputFile)) {
      outputs.collections[type].files.push(outputFile);
      await outputsSave(outputs);
    }
  }
};

let concurrency = 0;

export const outputPages = createDebounceQueue(async () => {
  try {
    concurrency++;
    if (concurrency > 1) {
      throw new Error(`Output pages concurrency is ${concurrency}`);
    }
    log.main("Output pages -> start");
    const {config} = await getConfig();
    const {collections} = config;
    for (const [type, _] of Object.entries(collections)) {
      const files = await Collection.all(type);
      await collectionClean(type, files);
      await collectionCreate(type, files);
    }

    concurrency--;
    log.main("Output pages -> done");
    /*
      const filePaths = await fs.readdir(contentPath);
      for (const filePath of filePaths) {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) continue;
      }
    */
  } catch (e) {
    concurrency--;
    throw e;
  }
});

export const outputPagesWatch = async () => {
  log.main("Init watching");
  const {config, paths} = await getConfig();
  const {collections} = config;

  const watchPaths = [];

  for (const [_, c] of Object.entries(collections)) {
    const contentPath = pathResolve(paths.root, c.contentPath);
    watchPaths.push(`${contentPath}/**/*.md`);
    watchPaths.push(`${contentPath}/**/*.mdx`);
  }

  log.main("Watch paths", watchPaths);

  return chokidar.watch(watchPaths).on("all", (event, path, stats) => {
    log.main("Watch event", {event, path});
    // if (event === "change") return;
    outputPages({})
      .then(() => {
        // log.main("Watch event processed");
      })
      .catch((e) => {
        log.error("Watch event error", e);
      });
  });
};
