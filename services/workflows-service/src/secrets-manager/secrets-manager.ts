export interface SecretsManager {
  getAll(): Promise<Record<string, string>>;
  set(data: Record<string, string>): Promise<void>;
}
