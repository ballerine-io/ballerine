export type FileRepositoryListener = (fileId: string, method: 'add' | 'remove') => void;

export class FileRepository {
  readonly filesById = new Map<string, File>();
  readonly idsByFiles = new Map<File, string>();
  private listeners: FileRepositoryListener[] = [];

  subscribe(listener: FileRepositoryListener) {
    if (this.listeners.find(existingListener => existingListener === listener)) return;

    this.listeners.push(listener);
  }

  unsubscribe(listener: FileRepositoryListener) {
    this.listeners = this.listeners.filter(existingListener => existingListener !== listener);
  }

  registerFile(fileId: string, file: File) {
    this.filesById.set(fileId, file);
    this.idsByFiles.set(file, fileId);

    this.onUpdate(fileId);
  }

  removeByFileId(fileId: string) {
    const existingFile = this.filesById.get(fileId);

    if (existingFile) {
      this.idsByFiles.delete(existingFile);
      this.filesById.delete(fileId);

      this.onRemoval(fileId);
    }
  }

  getFileId(file: File): string | null {
    return this.idsByFiles.get(file) || null;
  }

  getFileById(fileId: string): File | null {
    return this.filesById.get(fileId) || null;
  }

  private onUpdate(fileId: string) {
    this.listeners.forEach(listener => listener(fileId, 'add'));
  }

  private onRemoval(fileId: string) {
    this.listeners.forEach(listener => listener(fileId, 'remove'));
  }
}
