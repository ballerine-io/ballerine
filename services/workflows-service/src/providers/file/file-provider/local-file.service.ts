import {
  IFileProvider,
  TLocalFilePath,
  TRemoteFileConfig,
  TRemoteUri
} from "@/providers/file/types";
import fs from "fs";

export class LocalFileService implements IFileProvider {
  protected client;
  constructor(...args: any) {
    this.client = fs
  }

  async downloadFile(remoteFileConfig: TRemoteFileConfig, localFilePath: TLocalFilePath): Promise<TLocalFilePath> {
    return await this.copyFile(remoteFileConfig as TRemoteUri, localFilePath)
  }

  async isRemoteFileExists(remoteFileConfig: TLocalFilePath): Promise<boolean> {
    const localFilePath = remoteFileConfig

    return this.client.existsSync(localFilePath)
  }

  async copyFile(fromFilePath: TLocalFilePath, toFilePath: TLocalFilePath ): Promise<TLocalFilePath> {
    await this.client.copyFileSync(fromFilePath,toFilePath)

    return toFilePath
  }

  async uploadFile(...any: any): Promise<TRemoteFileConfig> {
    throw new Error("Unable to use upload to local file manager client, use downloadFile instead")
  }
}
