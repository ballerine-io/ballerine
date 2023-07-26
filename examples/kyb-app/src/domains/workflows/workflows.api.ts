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

  return storage.getData() || defaultFlowData;
};

export const updateFlowData = async (dto: UpdateFlowDataDto): Promise<WorkflowFlowData> => {
  const { workflowId, payload } = dto;

  const storage = workflowId ? new RevisionStorageService(workflowId) : new KYBStorageService();

  await storage.save(payload);

  return dto.payload;
};
