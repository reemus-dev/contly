import debug from "debug";

type LoggerOutput = "stderr" | "stdout";

const _createLogger = (name: string, output?: LoggerOutput) => {
  const logger = debug(`conte:${name}`);
  if (!output || output === "stdout") {
    logger.log = console.log.bind(console);
  }
  return logger;
};

export const createPackageLoggers = (pkg: string) => {
  const createLogger = (namespace: string, output?: LoggerOutput) => {
    if (!namespace) return _createLogger(pkg, output);
    return _createLogger(`${pkg}:${namespace}`, output);
  };

  const main = createLogger(``, "stdout");
  const error = createLogger(`error`);

  const createScopedLogger = (log: debug.Debugger, scope: string) => {
    return (...args: any[]) => log(`[${scope}]`, ...args);
  };

  const createScopedLoggers = (scope: string) => {
    return {
      main: createScopedLogger(main, scope),
      error: createScopedLogger(error, scope),
    };
  };

  return {createLogger, createScopedLogger, createScopedLoggers, main, error};
};
