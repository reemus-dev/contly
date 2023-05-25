import {UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, z} from "zod";
import {CollectionSchemas, CollectionTypes} from "@contly/core:types";
import {ConfigPaths} from "./paths.js";

type ZodSchema = ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, unknown, unknown>;

export const zodConfigCollection = z.object({
  component: z.string().min(1),
  contentPath: z.string().min(1),
  outputPath: z.string().min(1),
  schema: z.instanceof(ZodObject),
});
export const zodConfig = z.object({
  collections: z.record(zodConfigCollection),
});

export type ConfigCollection = z.infer<typeof zodConfigCollection>;
export type ConfigCollectionShape<Schema extends ZodSchema> = Omit<ConfigCollection, "schema"> & {
  schema: Schema;
};

export type Config<Types extends CollectionTypes = CollectionTypes> = {
  collections: {
    [key in Types]: ConfigCollectionShape<ZodSchema>;
  };
};
export type ConfigFn<Types extends string> = (zod: typeof z) => Promise<Config<string>>;

export type {ConfigPaths};
