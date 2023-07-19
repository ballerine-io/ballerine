import { request } from '@app/common/utils/request';
import { runAndStartWorkflowSerialize } from '@app/domains/workflows/serialize/run-and-start-workflow.serialize';
import {
  GetWofklowDto,
  GetWorkflowResponse,
  RunWorkflowDto,
  Workflow,
} from '@app/domains/workflows/types';

export const runAndStartWorkflowRequest = async (dto: RunWorkflowDto): Promise<void> => {
  const runPayload = runAndStartWorkflowSerialize(dto);

  const runResult = await request
    .post('external/workflows/run', {
      json: runPayload,
    })
    .json<{ workflowRuntimeId: string }>();

  await request.post(`external/workflows/${runResult.workflowRuntimeId}/send-event`, {
    json: {
      name: 'start',
    },
  });
};

export const fetchWorkflow = async (query: GetWofklowDto): Promise<Workflow> => {
  const result = await request.get(`external/workflows/${query.id}`).json<GetWorkflowResponse>();

  return result.workflowRuntimeData;
};
