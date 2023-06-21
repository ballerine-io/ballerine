import axios from 'axios';

export const request = axios.create({ baseURL: import.meta.env.VITE_API_URL });

request.interceptors.request.use(config => {
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${import.meta.env.VITE_API_KEY}`;
    return config;
  }
  return config;
});
