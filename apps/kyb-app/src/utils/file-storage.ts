export class FileStorage {
  readonly filesById = new Map<string, File>();
  readonly idsByFiles = new Map<File, string>();

  registerFile(fileId: string, file: File) {
    this.filesById.set(fileId, file);
    this.idsByFiles.set(file, fileId);
  }

  removeByFileId(fileId: string) {
    const existingFile = this.filesById.get(fileId);

    if (existingFile) {
      this.idsByFiles.delete(existingFile);
      this.filesById.delete(fileId);
    }
  }

  getFileId(file: File) {
    return this.idsByFiles.get(file);
  }

  getFileById(fileId: string) {
    return this.filesById.get(fileId);
  }
}
