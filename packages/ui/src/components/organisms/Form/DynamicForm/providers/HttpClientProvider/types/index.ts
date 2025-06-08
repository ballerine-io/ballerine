import { AxiosInstance } from 'axios';

export type THttpClient = AxiosInstance;

export interface IHttpClientProviderContext {
  httpClient: THttpClient;
}
