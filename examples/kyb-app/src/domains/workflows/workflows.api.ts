import { request } from '@app/common/utils/request';
import { RunWorkflowDto } from '@app/domains/workflows/types';

export const runWorkflowRequset = async (dto: RunWorkflowDto): Promise<void> => {
  await request.post('external/workflows/run', {
    json: {
      ...dto,
    },
  });
};
