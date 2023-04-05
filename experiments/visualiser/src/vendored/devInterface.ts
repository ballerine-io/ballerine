import { createDevTools } from '@xstate/inspect';

const devTools = createDevTools();

// @ts-ignore
globalThis.__xstate__ = devTools;

export { devTools };
