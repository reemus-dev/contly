import prettier from "prettier";
import {printNode, zodToTs} from "zod-to-ts";
import {consts, createDebounceQueue, fileWrite, getConfig} from "@contly/core";
import {createScopedLoggers} from "../../log.js";

const log = createScopedLoggers("OutputTypes");

export const outputTypes = createDebounceQueue(async () => {
  const {config, paths} = await getConfig();
  const {collections} = config;

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
declare module "${consts.MODULE_TYPES}" {
  export type CollectionTypes = ${schemaListString};
  export type CollectionSchemas = {
    ${schemaTypesString}
  };
}
`;

  await fileWrite(paths.files.temp.types, prettier.format(output, {parser: "typescript"}));
  log.main("Types generated");
});
