export class FileStorage {
  private storage: Map<string, File> = new Map();

  add(key: string, file: File) {
    if (this.storage.has(key)) {
      this.removeFile(key);
    }

    this.storage.set(key, file);
  }

  remove(key: string) {
    this.removeFile(key);
  }

  private removeFile(key: string) {
    this.storage.delete(key);
  }
}
