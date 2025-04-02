export interface IAccessTokenContext {
  wfIdToken: string | null;
  accessToken: string | null;
  setWfIdToken: (wfIdToken: string) => void;
  setAccessToken: (accessToken: string) => void;
}
