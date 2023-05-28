import _ from "lodash";
import pQueue from "p-queue";
import {createScopedLoggers} from "../internal/log.js";
import {sleep} from "./utils.js";

const log = createScopedLoggers("DebounceQueue");

export const createDebounceQueue = <Args, Result>(process: (arg: Args) => Promise<Result>) => {
  // const queue = {
  //   debounce: new pQueue({concurrency: 1}),
  //   execute: new pQueue({concurrency: 1}),
  // };
  // const debounce = new pQueue({concurrency: 1});

  type Invoke = (arg: Args) => Promise<Result | null>;

  const queue = new pQueue({
    concurrency: 1,
    // Required to prevent void return type from queue.add
    // Note: this doesn't even work right now to infer the correct types
    timeout: Infinity,
    throwOnTimeout: true,
  });

  let count = 1;

  const state = {
    pending: false,
    queued: false,
  };

  const queueValidate = () => {
    const running = queue.pending;
    const queued = queue.size;
    if (running > 1) {
      throw new Error(`DebounceQueue: more than one invocation running (${running})`);
    }
    if (queued > 1) {
      throw new Error(`DebounceQueue: more than one invocation queued (${queued})`);
    }
  };

  const queueInvoke = async (i: number) => {
    log.main(`Invoke (${i}) -> queued`);
    state.queued = true;
    while (state.pending) {
      await sleep(100);
    }
    state.queued = false;
  };

  const invoke: Invoke = async (arg) => {
    try {
      count++;
      const i = count;
      if (state.pending && state.queued) {
        log.main(`Invoke (${i}) -> cancelled`);
        return null;
      }

      await queueInvoke(i);

      // log.main("Invoke -> init");
      // If invocation is pending, terminate
      // if (invokePending) {
      // log.main("Invoke -> cancelled");
      // return null;
      // }

      log.main(`Invoke (${i}) -> proceed`);
      state.pending = true;

      // Check queue constraints
      queueValidate();

      // Wait until existing invocation is complete
      await queue.onIdle();

      const result = (await queue.add(() => process(arg))) as Result;
      state.pending = false;

      log.main(`Invoke (${i}) -> done`);

      return result;
    } catch (e) {
      state.pending = false;
      throw e;
    }
  };

  return _.debounce(invoke, 100, {leading: true, trailing: true}) as Invoke;
};
