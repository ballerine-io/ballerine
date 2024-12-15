export interface ISupabaseService {
  logSignIn(url: string): Promise<void>;
  logInfraData(infradata: JSON): Promise<void>;
}
