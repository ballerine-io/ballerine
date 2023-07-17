import { request } from '@app/common/utils/request';
import { RunWorkflowDto } from '@app/domains/workflows/types';

export const runAndStartWorkflowRequest = async (dto: RunWorkflowDto): Promise<void> => {
  const runResult = await request
    .post('external/workflows/run', {
      json: {
        ...dto,
      },
    })
    .json<{ workflowRuntimeId: string }>();

  await request.post(`external/workflows/${runResult.workflowRuntimeId}/send-event`, {
    json: {
      name: 'start',
    },
  });
};
