import axios from 'axios';

export const request = axios.create({
  //@ts-ignore
  baseURL: (globalThis as any).env?.VITE_API_URL ?? import.meta.env.VITE_API_URL,
  withCredentials: true,
});

request.interceptors.request.use(config => {
  if (config.headers) {
    config.headers['Authorization'] = `Api-Key ${
      (globalThis as any).env?.VITE_API_KEY ?? import.meta.env.VITE_API_KEY
    }`;
    return config;
  }
  return config;
});
