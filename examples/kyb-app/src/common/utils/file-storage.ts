type FileId = string;

export class FileStorage {
  private storage: Map<string, File> = new Map();

  add(file: File): string {
    const fileId = this.getFileId(file);

    if (this.isExists(fileId)) return fileId;

    this.storage.set(fileId, file);

    return fileId;
  }

  remove(key: string) {
    this.removeFile(key);
  }

  get(key: string): File | null {
    return this.storage.get(key) || null;
  }

  isExists(key: string): boolean {
    return this.storage.has(key);
  }

  private removeFile(key: string) {
    this.storage.delete(key);
  }

  private getFileId(file: File): FileId {
    return `fileRef::${file.name}`;
  }
}
