import fs from "fs-extra";
import vm from "node:vm";
import {z} from "zod";
import {CollectionTypes} from "@conte/core:types";
import {fileRead, pathExistsMulti} from "../../lib/utils.js";
import {ConfigPaths, getPaths} from "./paths.js";
import {Config, ConfigFn, zodConfig} from "./types.js";

const cache: {
  data: null | {paths: ConfigPaths; config: Config<CollectionTypes>};
} = {
  data: null,
};

export const getConfig = async (params?: {cwd?: string}) => {
  if (cache.data) {
    return cache.data;
  }

  const paths = await getPaths(params);
  const configPath = await pathExistsMulti([
    paths.files.config.js,
    paths.files.config.cjs,
    paths.files.config.mjs,
  ]);

  if (!configPath) {
    throw new Error(`Config file not found at ${paths.files.config.js}|cjs|mjs`);
  }

  const configContent = await fileRead(configPath);
  const configCode = configContent
    .replace("export default", "fn =")
    .replace("module.exports =", "fn =");
  // const iifeCode = `(function(exports){${configCode}}(module.exports));`;

  const sandbox: {fn?: ConfigFn<string>} = {};
  vm.createContext(sandbox);

  const script = new vm.Script(configCode);
  script.runInNewContext(sandbox);

  if (!sandbox.fn) {
    throw new Error(`Config file not valid`);
  }

  // const configImport = module === "esm" ? `file:///${configPath}` : configPath;
  // const configFn = new AsyncFunction(configContent);
  // const configRaw = await configFn();
  // const configRaw = {} as any;
  const configRaw = await sandbox.fn(z);
  // const configFile = await import(configImport);
  // const config: NextPluginConfig<string> = await configFile.default();
  // const configRaw = await configFile.default();
  const configValid = await zodConfig.safeParseAsync(configRaw);
  if (!configValid.success) {
    throw new Error(`Config file not valid:\n${configValid.error.toString()}`);
  }

  const config = configValid.data;

  cache.data = {paths, config};
  return {paths, config};
};
