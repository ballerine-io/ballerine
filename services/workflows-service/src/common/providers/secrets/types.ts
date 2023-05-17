export interface ISecretsManager {
  fetchSecret: (key: string) => Promise<unknown | null>;
}
