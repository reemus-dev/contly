import debug, {Debugger} from "debug";

// Logger type taken from @types/debug
// This is needed to avoid error "The inferred type of 'logger' cannot be named without a reference to"
export type Logger = {
  (formatter: any, ...args: any[]): void;
  color: string;
  diff: number;
  enabled: boolean;
  log: (...args: any[]) => any;
  namespace: string;
  destroy: () => boolean;
  extend: (namespace: string, delimiter?: string) => Debugger;
};
export type LoggedScoped = (...args: any[]) => void;
export type LoggerOutput = "stderr" | "stdout";
export type LoggerCreate = (output: LoggerOutput, pkg: string, namespace?: string) => Logger;
export type LoggerCreateScoped = (log: Logger, scope: string) => LoggedScoped;

export const createLogger: LoggerCreate = (output, pkg, namespace) => {
  const name = namespace ? `${pkg}:${namespace}` : pkg;
  const logger = debug(`contly:${name}`);
  if (!output || output === "stdout") {
    logger.log = console.log.bind(console);
  }
  return logger;
};

export const createLoggerScoped: LoggerCreateScoped = (log, scope) => {
  return (...args) => log(`[${scope}]`, ...args);
};

export const createPackageLoggers = (pkg: string) => {
  const main = createLogger("stdout", pkg);
  const error = createLogger(`stderr`, pkg, `error`);
  const logger = {main, error};

  const createScopedLoggers = (scope: string) => {
    return {
      main: createLoggerScoped(main, scope),
      error: createLoggerScoped(error, scope),
    };
  };

  return {logger, createScopedLoggers};
};
