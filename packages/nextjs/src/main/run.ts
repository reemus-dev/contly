import chokidar from "chokidar";
import exitHook, {asyncExitHook} from "exit-hook";
import prettier from "prettier";
import {z} from "zod";
import {printNode, zodToTs} from "zod-to-ts";
import {consts, fileRead, fileWrite, getPaths} from "@contly/core";
import {NextPluginConfigFn} from "../types.js";
import {getProcessLock} from "./lock.js";

export {};
/*

const watchUpdateNextEnv = async () => {
  const paths = await getPaths();

  async function update() {
    try {
      const content = await fileRead(paths.files.next.env);
      const reference = `/// <reference types="${consts.TEMP_DIR}/types.d.ts" />`;
      if (!content.includes(reference)) {
        const updated = `${content}\n/// <reference types="${consts.TEMP_DIR}/types.d.ts" />`;
        await fileWrite(paths.files.next.env, updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  await update();
  const watcher = chokidar.watch(paths.files.next.env).on("change", () => {
    console.log(`File change detected: ${paths.files.next.env}`);
    update();
  });

  exitHook(() => {
    console.log("exitHook");
    watcher.close();
  });
  asyncExitHook(
    async () => {
      console.log("asyncExitHook");
      await watcher.close();
    },
    {
      minimumWait: 1000,
    }
  );
};

const generateTypes = async (options: NextPluginConfigFn<string>) => {
  const paths = await getPaths();
  const config = await options(z);
  const collections = config.collections;
  // const collectionTypes = Object.keys(collections);

  const schemaList = Object.keys(collections);
  const schemaTypes = Object.entries(collections).map(([key, collection]) => {
    const parsed = zodToTs(collection.schema, key);
    const ts = printNode(parsed.node);
    return {key, ts};
  });

  const schemaListString = schemaList.map((key) => `"${key}"`).join(" | ");
  const schemaTypesString = schemaTypes
    .map(({key, ts}) => {
      return `${key}: ${ts}`;
    })
    .join(`,\n`);

  console.log(schemaTypesString);

  const output = `
declare module "mdxn:content" {
  export type CollectionTypes = ${schemaListString};
  export type CollectionSchemas = {
    ${schemaTypesString}
  };
}
`;

  await fileWrite(paths.files.types, prettier.format(output, {parser: "typescript"}));
};

const contly = async (options: NextPluginConfigFn<string>) => {
  const locked = await getProcessLock();
  if (!locked) return;
  // console.log("mdxkit-next", locked, process.pid);

  const paths = await getPaths();
  // const collections = options.collections(z);
  // const collectionTypes = Object.keys(collections);

  await generateTypes(options);
};

export default contly;
*/
