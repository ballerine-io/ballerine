import { rest } from 'msw';
import { env } from '../../../env/env';
import { endUsers } from './end-users.data';

export const endUsersController = [
  // List
  rest.get(`${env.VITE_API_URL}/end-users`, (req, res, ctx) => {
    return res(
      ctx.json({
        endUsers: endUsers.findAll(),
      }),
    );
  }),
  // Get by ID
  rest.get(`${env.VITE_API_URL}/end-users/:id`, (req, res, ctx) => {
    const id = req.params.id;

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const endUser = endUsers.findById(id);

    if (!endUser) {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        endUser,
      }),
    );
  }),
  // Update by ID
  rest.patch(`${env.VITE_API_URL}/end-users/:id`, async (req, res, ctx) => {
    const id = req.params.id;
    const body = await req.json();

    if (
      typeof id !== 'string' ||
      !id.length ||
      (body?.state !== 'approved' && body?.state !== 'rejected')
    ) {
      return res(ctx.status(400));
    }

    const endUser = endUsers.findById(id);

    if (!endUser) {
      return res(ctx.status(404));
    }

    endUsers.updateById(id, {
      state: body?.state,
      checkResults: {
        ...endUser?.checkResults,
        finalResult: body?.state,
      },
    });

    return res(
      ctx.json({
        endUsers: endUsers.findAll(),
      }),
    );
  }),
];
