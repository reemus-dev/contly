import fs from "fs-extra";
import {getConfig} from "@contly/core";
import {FileOutputs} from "../../types.js";

export const outputsGet = async (): Promise<FileOutputs> => {
  const {paths} = await getConfig();
  if (await fs.exists(paths.files.temp.outputs)) {
    return (await fs.readJSON(paths.files.temp.outputs)) as FileOutputs;
  }
  return {
    collections: {},
  };
};

export const outputsSave = async (outputs: FileOutputs) => {
  const {paths} = await getConfig();
  await fs.writeJSON(paths.files.temp.outputs, outputs, {spaces: 2});
};
