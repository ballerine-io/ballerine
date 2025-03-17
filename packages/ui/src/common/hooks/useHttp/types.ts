export interface IHttpParams {
  url: string;
  resultPath?: string;
  headers?: Record<string, string>;
  method?: 'POST' | 'PUT' | 'GET' | 'DELETE';
  timeout?: number;
}
