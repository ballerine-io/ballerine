import {
  IFileProvider,
  TLocalFilePath,
  TRemoteFileConfig, TRemoteUri,
} from "@/providers/file/types";
import { createReadStream, createWriteStream, promises as fsPromises } from "fs";
import axios from "axios"; // TODO: NEED to push to package

class AwsS3Service implements IFileProvider {
  private client = axios;

  async downloadFile(remoteFileConfig: TRemoteUri, localFilePath: TLocalFilePath): Promise<TLocalFilePath> {
    try {
      const response = await this.client.get(remoteFileConfig, { responseType: "arraybuffer" });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const fileBuffer = response.data;
      await fsPromises.writeFile(localFilePath, Buffer.from(fileBuffer));
      return localFilePath;
    } catch (error) {
      console.error("Error downloading the file:", error);
      throw error;
    }
  }

  async isRemoteFileExists(remoteFileConfig: TRemoteUri): Promise<boolean> {
    try {
      const response = await this.client.head(remoteFileConfig);
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error("Error checking if remote file exists:", error);
      throw error;
    }
  }

  async uploadFile(localFilePath: TLocalFilePath, remoteFileConfig: TRemoteFileConfig): Promise<void> {
    throw new Error("Unable to use upload to uri client")
  }
}
