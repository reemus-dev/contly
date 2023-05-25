import {createPackageLoggers} from "@conte/core";

const {main, error, createLogger, createScopedLogger, createScopedLoggers} =
  createPackageLoggers("nextjs");

export {createLogger, createScopedLogger, createScopedLoggers};

export const logger = {main, error};
