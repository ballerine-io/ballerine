export interface ISecretsManager {
  getSecret: (key: string) => Promise<unknown | null>;
}
