export interface SnapshotContext<TData = object> {
  getData: () => TData;
  save: (data: TData) => Promise<void> | void;
  clear: () => void | Promise<void>;
}

export type BeforeSaveHook<TData = object> = (data: TData) => Promise<TData> | TData;
export type AfterSaveHook<TData = object> = (data: TData) => void;
