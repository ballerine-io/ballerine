export interface IAccessTokenContext {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
}
