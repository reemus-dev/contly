import crypto from "node:crypto";

const _AsyncFunction = async () => {};
export const AsyncFunction = Object.getPrototypeOf(_AsyncFunction).constructor;

export const jsonStringifyBase64 = (data: unknown) => {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};

export const jsonParseBase64 = <T>(data: string) => {
  const deserialized = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(deserialized) as T;
};

export const writeStdout = (data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stdout.write(data, (err) => {
      return err ? reject(err) : resolve();
    });
  });
};

export const writeStderr = (data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stderr.write(data, (err) => {
      return err ? reject(err) : resolve();
    });
  });
};

export const randomId = (size: number) => {
  const buffer = crypto.randomBytes(Math.ceil(size / 2));
  return buffer.toString("hex");
};

export const sleep = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
