import { rest } from 'msw';
import { sleep } from '../../utils/sleep/sleep';
import { data } from './users.data';
import { DEFAULT_RESPONSE_TIME } from '../constants';

// Get all users
const getUsers = rest.get('/users', async (req, res, ctx) => {
  await sleep(DEFAULT_RESPONSE_TIME);

  return res(ctx.json(data.users), ctx.set('x-total-count', data.users.length.toString()));
});

// Get a single user
const getUser = rest.get('/users/:id', async (req, res, ctx) => {
  await sleep(DEFAULT_RESPONSE_TIME);

  const user = data.users.find(user => user.id === req.params.id);

  return res(ctx.json(user));
});

// Reject and approve user
const updateUserState = rest.patch('/users/:id', async (req, res, ctx) => {
  await sleep(DEFAULT_RESPONSE_TIME);

  const { state } = await req.json();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  data.users = data.users.map(user =>
    user.id === req.params.id
      ? {
          ...user,
          state,
        }
      : user,
  );

  return res(ctx.json(data.users));
});

// Get a single user
const getUserMedia = rest.get('/users/media', async (req, res, ctx) => {
  await sleep(DEFAULT_RESPONSE_TIME);

  const user = data.users.find(user => user.id === req.params.id);

  return res(ctx.json(user));
});

// Get a single user
const getUserMediaItem = rest.get('/users/media/:id', async (req, res, ctx) => {
  await sleep(DEFAULT_RESPONSE_TIME);

  const user = data.users.find(user => user.id === req.params.id);

  return res(ctx.json(user));
});

export const usersHandler = [getUsers, getUser, updateUserState];
