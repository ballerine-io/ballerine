import { ISnapshotStore } from '@app/common/providers/SnapshotProvider';

export class RevisionStorageService<TData extends object> implements ISnapshotStore<TData> {
  private readonly STORAGE_KEY = 'revision_kyb_state';

  constructor(private readonly workflowId: string) {}

  getData<TData>() {
    const data = this.getRawData();
    if (!data) return;

    return data[this.workflowId] as unknown as TData;
  }

  save(payload: TData) {
    let data = this.getRawData();
    if (!data) {
      data = {};
    }

    data[this.workflowId] = payload;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private getRawData(): Record<string, TData> | void {
    const dataInStorage = localStorage.getItem(this.STORAGE_KEY);

    if (!dataInStorage) return;

    return JSON.parse(dataInStorage) as Record<string, TData>;
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
