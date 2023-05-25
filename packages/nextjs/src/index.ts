import {z} from "zod";
import {NextPluginConfigFn} from "./types.js";

export const createConfig = (options: NextPluginConfigFn) => {
  return async () => await options(z);
};

export default createConfig;
export type {NextPluginConfigFn};
