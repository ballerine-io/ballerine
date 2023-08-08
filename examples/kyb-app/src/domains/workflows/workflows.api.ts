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
  UpdateFlowDataDto,
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

  await request.patch(`internal/workflows/${dto.workflowId}`, {
    json: payload,
  });
};

export const fetchFlowData = (dto: GetFlowDataDto): WorkflowFlowData => {
  const { workflowId } = dto;

  const storage = workflowId ? new RevisionStorageService(workflowId) : new KYBStorageService();

  const data = storage.getData() || defaultFlowData;

  return data as WorkflowFlowData;
};

export const updateFlowData = async (dto: UpdateFlowDataDto): Promise<WorkflowFlowData> => {
  const { workflowId, payload } = dto;

  const flowStorage = new KYBStorageService();
  const workflowStorage = new RevisionStorageService(workflowId);
  const storage = workflowId ? workflowStorage : flowStorage;

  await storage.save(payload);

  const isShouldClearFlowStorage = Boolean(workflowId);

  if (isShouldClearFlowStorage) {
    flowStorage.clear();
  }

  return dto.payload;
};

export const fetchActiveWorkflow = async (dto: GetActiveWorkflowDto): Promise<Workflow | null> => {
  const result = await request
    .get('collection-flow/active-flow', {
      searchParams: { email: dto.email },
    })
    .json<{ result: Workflow }>();

  return result.result;
};
