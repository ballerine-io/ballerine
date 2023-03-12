import { rest } from 'msw';
import { env } from '../../../env/env';
import { workflows } from './workflows.data';

const workflowCore = {
  sendEvent({ type }) {
    return;
  },
};

export const workflowsController = [
  // List
  rest.get(`${env.VITE_API_URL}/workflows`, (req, res, ctx) => {
    return res(
      ctx.json({
        workflows: workflows.findAll(),
      }),
    );
  }),
  // Get by ID
  rest.get(`${env.VITE_API_URL}/workflows/:id`, (req, res, ctx) => {
    const id = req.params.id;

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const workflow = workflows.findById(id);

    if (!workflow) {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        workflow,
      }),
    );
  }),
  // Update by ID
  rest.patch(`${env.VITE_API_URL}/workflows/:id`, async (req, res, ctx) => {
    const id = req.params.id;
    const body = await req.json();

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const workflow = workflows.findById(id);

    if (!workflow) {
      return res(ctx.status(404));
    }

    workflows.updateById(id, {
      state: body?.state,
      context: {
        ...workflow?.context,
        ...body?.context,
      },
    });

    return res(
      ctx.json({
        workflows: workflows.findAll(),
      }),
    );
  }),
  rest.post(`${env.VITE_API_URL}/workflows/:id/event`, async (req, res, ctx) => {
    const id = req.params.id;
    const body = await req.json();

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const workflow = workflows.findById(id);

    if (!workflow) {
      return res(ctx.status(404));
    }

    workflowCore.sendEvent({ type: body?.name });

    // const state = workflowCore.getSnapShot().state.value;

    // workflows.updateById(id, {
    //   state,
    // });

    return res(
      ctx.json({
        workflows: workflows.findAll(),
      }),
    );
  }),
];
