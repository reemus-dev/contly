export const consts = {
  PROD: process.env.NODE_ENV === "production",
  TEMP_DIR: `.contly`,
  CONFIG_FILE_NAME: `contly.config`,
  MODULE_TYPES: `@contly/core:types`,
};
