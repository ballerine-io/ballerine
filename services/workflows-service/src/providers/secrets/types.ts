export interface ISecretsManager {
  getSecret: (key: string) => Promise<any | null>;
}
