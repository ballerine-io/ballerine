export abstract class ISnapshotStore<TData = object> {
  abstract save(data: TData): void;

  abstract getData<TData>(): TData | undefined;

  abstract clear(): void | void;
}
