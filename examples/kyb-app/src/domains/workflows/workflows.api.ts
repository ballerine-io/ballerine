import { request } from '@app/common/utils/request';
import { defaultFlowData } from '@app/domains/workflows/default-flow-data';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { serializeWorkflowUpdatePayload } from '@app/domains/workflows/serialize/run-and-start-workflow.serialize';
import { KYBStorageService } from '@app/domains/workflows/storages/kyb-storage-service';
import { RevisionStorageService } from '@app/domains/workflows/storages/revision-storage-service/revision-storage-service';
import {
  GetFlowDataDto,
  GetWofklowDto,
  GetWorkflowResponse,
  WorkflowUpdatePayload,
  UpdateWorkflowDto,
  Workflow,
  GetActiveWorkflowDto,
} from '@app/domains/workflows/types';

export const runWorkflowRequest = async (dto: WorkflowUpdatePayload): Promise<void> => {
  const runPayload = serializeWorkflowUpdatePayload(dto);

  await request
    .post('external/workflows/run', {
      json: runPayload,
    })
    .json<{ workflowRuntimeId: string }>();
};

export const runAndStartWorkflowRequest = async (
  dto: WorkflowUpdatePayload,
): Promise<{ workflowRuntimeId: string }> => {
  const runPayload = serializeWorkflowUpdatePayload(dto);

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

  return runResult;
};

export const fetchWorkflow = async (query: GetWofklowDto): Promise<Workflow> => {
  const result = await request.get(`external/workflows/${query.id}`).json<GetWorkflowResponse>();

  return result.workflowRuntimeData;
};

export const updateWorkflow = async (dto: UpdateWorkflowDto) => {
  const { workflowId: _, ...payload } = serializeWorkflowUpdatePayload(dto.payload);

  await request.patch(`external/workflows/${dto.workflowId}`, {
    json: payload,
  });
};

export const fetchActiveWorkflow = async (dto: GetActiveWorkflowDto): Promise<Workflow | null> => {
  const result = await request
    .get('collection-flow/active-flow', {
      searchParams: {
        email: dto.email,
        workflowRuntimeDefinitionId: import.meta.env.VITE_KYB_DEFINITION_ID as string,
      },
    })
    .json<{ result: Workflow }>();

  return result.result;
};
