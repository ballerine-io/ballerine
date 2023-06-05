import { rest } from 'msw';
import { env } from '../../../common/env/env';
import { individuals } from './individuals.data';

export const individualsController = [
  // List
  rest.get(`${env.VITE_API_URL}/end-users`, (req, res, ctx) => {
    return res(
      ctx.json({
        individuals: individuals.findAll(),
      }),
    );
  }),
  // Get by ID
  rest.get(`${env.VITE_API_URL}/end-users/:id`, (req, res, ctx) => {
    const id = req.params.id;

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const individual = individuals.findById(id);

    if (!individual) {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        individual,
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
      (body?.approvalState !== 'APPROVED' && body?.approvalState !== 'REJECTED')
    ) {
      return res(ctx.status(400));
    }

    const individual = individuals.findById(id);

    if (!individual) {
      return res(ctx.status(404));
    }

    individuals.updateById(id, {
      approvalState: body?.approvalState,
      checkResults: {
        ...individual?.checkResults,
        finalResult: body?.approvalState,
      },
    });

    return res(
      ctx.json({
        individuals: individuals.findAll(),
      }),
    );
  }),
];
