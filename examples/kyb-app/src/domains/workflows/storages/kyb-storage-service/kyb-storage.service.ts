import { IStore } from '@app/domains/workflows/storages/abstract-store/abstract-store';

export class KYBStorageService<TData extends object> implements IStore<TData> {
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
