import { request } from '@app/common/utils/request';
import { defaultFlowData } from '@app/domains/workflows/default-flow-data';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { runAndStartWorkflowSerialize } from '@app/domains/workflows/serialize/run-and-start-workflow.serialize';
import { KYBStorageService } from '@app/domains/workflows/storages/kyb-storage-service';
import { RevisionStorageService } from '@app/domains/workflows/storages/revision-storage-service/revision-storage-service';
import {
  GetFlowDataDto,
  GetWofklowDto,
  GetWorkflowResponse,
  RunWorkflowDto,
  UpdateFlowDataDto,
  UpdateWorkflowDto,
  Workflow,
} from '@app/domains/workflows/types';

export const runWorkflowRequest = async (dto: RunWorkflowDto): Promise<void> => {
  const runPayload = runAndStartWorkflowSerialize(dto);

  await request
    .post('external/workflows/run', {
      json: runPayload,
    })
    .json<{ workflowRuntimeId: string }>();
};

export const runAndStartWorkflowRequest = async (
  dto: RunWorkflowDto,
): Promise<{ workflowRuntimeId: string }> => {
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

  return runResult;
};

export const fetchWorkflow = async (query: GetWofklowDto): Promise<Workflow> => {
  const result = await request.get(`external/workflows/${query.id}`).json<GetWorkflowResponse>();

  return result.workflowRuntimeData;
};

export const updateWorkflow = async (dto: UpdateWorkflowDto) => {
  await request.patch(`internal/workflows/${dto.workflowId}`, {
    json: {
      context: {
        documents: dto.payload.context.documents,
      },
    },
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
