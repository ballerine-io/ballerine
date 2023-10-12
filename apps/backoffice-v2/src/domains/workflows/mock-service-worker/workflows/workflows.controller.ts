import { rest } from 'msw';
import { env } from '../../../../common/env/env';
import { workflows } from './workflows.data';
import { createWorkflow } from '@ballerine/workflow-node-sdk';
import { individuals } from '../../../individuals/mock-service-worker/individuals.data';
import { CommonWorkflowStates } from '@ballerine/common';

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
  rest.get(`${env.VITE_API_URL}/workflows/:id`, async (req, res, ctx) => {
    const id = req.params.id;

    if (typeof id !== 'string' || !id.length) {
      return res(ctx.status(400));
    }

    const response = await fetch(`http://localhost:3000/api/internal/workflows/${id}`);
    const data = await response.json();
    // const type = req.url.searchParams.get('type');
    // const name = req.url.searchParams.get('name');
    // const workflow = workflows
    // .findAll()
    // .find(workflow => workflow.name === name && workflow.state.type === type);

    // if (!workflow) {
    // return res(ctx.status(404));
    // }

    return res(
      ctx.json({
        workflow: data,
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
      approvalState: body?.approvalState,
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

    const entityId = req.url.searchParams.get('entityId');
    const endUser = individuals.findById(entityId);
    const workflow = endUser?.workflows?.find(workflow => workflow.id === id);

    if (!workflow) {
      return res(ctx.status(404));
    }

    const workflowService = createWorkflow(workflow);

    workflowService.runner.sendEvent({ type: body?.name });

    const snapshot = workflowService.runner.getSnapshot();
    const state = snapshot.value;

    individuals.updateById(entityId, {
      approvalState:
        state === 'APPROVE' ? CommonWorkflowStates.APPROVED : CommonWorkflowStates.REJECTED,
      workflows: endUser?.workflows?.map(workflow => {
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
