import { ISnapshotStore } from '@app/common/providers/SnapshotProvider';

export class KYBStorageService<TData extends object> implements ISnapshotStore<TData> {
  private readonly STORAGE_KEY = 'kyb_state';

  getData<TData>() {
    const dataInStorage = localStorage.getItem(this.STORAGE_KEY);

    return dataInStorage ? (JSON.parse(dataInStorage) as TData) : undefined;
  }

  save(data: TData): void | Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
