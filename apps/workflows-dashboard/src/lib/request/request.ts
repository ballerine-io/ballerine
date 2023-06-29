import axios from 'axios';

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

request.interceptors.request.use(config => {
  if (config.headers) {
    config.headers['Authorization'] = `Api-Key ${import.meta.env.VITE_API_KEY}`;
    return config;
  }
  return config;
});
