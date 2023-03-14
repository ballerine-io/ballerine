import { rest } from 'msw';
import { env } from '../../../env/env';
import { workflows } from './workflows.data';
import { initNodeWorkflow } from '@ballerine/workflow-node-sdk';
import { endUsers } from '../end-users/end-users.data';

// const workflowCore = {
//   sendEvent({ type }) {
//     return;
//   },
// };

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

    const endUserId = req.url.searchParams.get('endUserId');
    const endUser = endUsers.findById(endUserId);
    const workflow = endUser?.activeWorkflows?.find(workflow => workflow.id === id);

    if (!workflow) {
      return res(ctx.status(404));
    }

    const workflowService = initNodeWorkflow(workflow);

    workflowService.runner.sendEvent({ type: body?.name });

    const snapshot = workflowService.runner.getSnapshot();
    const state = snapshot.value;

    endUsers.updateById(endUserId, {
      state: state === 'APPROVE' ? 'approved' : 'rejected',
      activeWorkflows: endUser?.activeWorkflows?.map(workflow => {
        if (workflow.id !== id) return workflow;

        return {
          ...workflow,
          state,
          workflowDefinition: {
            ...workflow.workflowDefinition,
            initial: state,
          },
        };
      }),
    });

    return res(
      ctx.json({
        workflows: workflows.findAll(),
      }),
    );
  }),
];
