export class GcpGcsFileConfig {
  /**
   * GCS bucket where identity documents are stored.
   *
   * We reuse the same bucket provisioned by the Identity Terraform stack and already
   * used by unified-api/document-api (`DOCUMENT_STORAGE_BUCKET`).
   */
  static getBucketName(processEnv: NodeJS.ProcessEnv) {
    return processEnv['DOCUMENT_STORAGE_BUCKET'];
  }

  static isConfigured(processEnv: NodeJS.ProcessEnv) {
    return !!this.getBucketName(processEnv);
  }
}
