/// <reference types="svelte" />

declare global {
  var __APP_VERSION__: string;
  interface Window {
    isProd: any;
    __blrn_context: any;
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type StringKV = { [key: string]: string };
