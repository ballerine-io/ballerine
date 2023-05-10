import {IFileProvider, TLocalFilePath} from "@/providers/file/types";
import fs from "fs";

class localManagerService implements IFileProvider {
  protected client = fs;

  async downloadFile(remoteFileConfig: TLocalFilePath, localFilePath: TLocalFilePath): Promise<TLocalFilePath> {
    return await this.copyFile(remoteFileConfig, localFilePath)
  }

  async isRemoteFileExists(remoteFileConfig: TLocalFilePath): Promise<boolean> {
    const localFilePath = remoteFileConfig

    return this.client.existsSync(localFilePath)
  }

  async copyFile(fromFilePath: TLocalFilePath, toFilePath: TLocalFilePath ): Promise<TLocalFilePath> {
    await this.client.copyFileSync(fromFilePath,toFilePath)

    return toFilePath
  }

  async uploadFile(localFilePath: TLocalFilePath, remoteFileConfig: TLocalFilePath): Promise<void> {
    throw new Error("Unable to use upload to local file manager client, use downloadFile instead")
  }
}
