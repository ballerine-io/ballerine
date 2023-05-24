import { rest } from 'msw';
import { env } from '../../../../common/env/env';
import { auth } from './auth.data';

export const authController = [
  // Sign in
  rest.post(`${env.VITE_API_URL}/auth/sign-in`, (req, res, ctx) => {
    auth.user = {
      email: 'admin@admin.com',
    };

    return res(ctx.json({}));
  }),
  // Sign in with Google
  rest.post(`${env.VITE_API_URL}/auth/sign-in/google`, (req, res, ctx) => {
    auth.user = {
      email: 'admin@admin.com',
    };

    return res(ctx.json({}));
  }),
  // Sign out
  rest.post(`${env.VITE_API_URL}/auth/sign-out`, (req, res, ctx) => {
    auth.user = undefined;

    return res(ctx.json({}));
  }),
  // Get session
  rest.get(`${env.VITE_API_URL}/auth/session`, (req, res, ctx) => {
    return res(
      ctx.json({
        user: auth.user,
      }),
    );
  }),
];
