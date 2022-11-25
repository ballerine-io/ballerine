import { AuthProvider } from '@pankod/refine-core';

export const TOKEN_KEY = 'refine-auth';

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }: { username?: string; email?: string; password: string }) => {
    const login = username || email;

    if (login && password) {
      localStorage.setItem(TOKEN_KEY, login);
      return Promise.resolve();
    }
    return Promise.reject(new Error('username: admin, password: admin'));
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
  getUserIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: 1,
    });
  },
};
