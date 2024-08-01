export interface SecretsManager {
  getAll(): Promise<Record<string, string>>;
  set(data: Record<string, string | undefined>): Promise<void>;
  delete(key: string): Promise<void>;
}
