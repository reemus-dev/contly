import {ConfigFn} from "@conte/core";

export type FileOutputs = {
  collections: Record<
    string,
    {
      files: string[];
    }
  >;
};

// export type NextPluginConfigFn = (zod: typeof z) => Promise<Config>;
export type NextPluginConfigFn = ConfigFn<string>;
