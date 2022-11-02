/// <reference types="svelte" />

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type StringKV = { [key: string]: string };
