/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EndUserState, WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { CompleteWorkflowData, RunnableWorkflowData } from './types';
import { createWorkflow } from '@ballerine/workflow-node-sdk';
import { IObjectWithId } from '@/types';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { merge } from 'lodash';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';

export const ResubmissionReason = {
  BLURRY_IMAGE: 'BLURRY_IMAGE',
  CUT_IMAGE: 'CUT_IMAGE',
  UNSUPPORTED_DOCUMENT: 'UNSUPPORTED_DOCUMENT',
  DAMAGED_DOCUMENT: 'DAMAGED_DOCUMENT',
  EXPIRED_DOCUMENT: 'EXPIRED_DOCUMENT',
  COPY_OF_A_COPY: 'COPY_OF_A_COPY',
  FACE_IS_UNCLEAR: 'FACE_IS_UNCLEAR',
  FACE_IS_NOT_MATCHING: 'FACE_IS_NOT_MATCHING',
} as const;
export interface WorkflowData {
  workflowDefinition: object;
  workflowRuntimeData: object;
}

// Discuss model classes location
export type IntentResponse = WorkflowData[];

// TODO: TEMP (STUB)
const policies = {
  signup: (_ctx: unknown): { workflowDefinitionId: string; version: number }[] => {
    return [{ workflowDefinitionId: 'COLLECT_DOCS_b0002zpeid7bq9aaa', version: 1 }];
  },
};

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly endUserRepository: EndUserRepository,
  ) {}

  async createWorkflowDefinition(args: Parameters<WorkflowDefinitionRepository['create']>[0]) {
    return await this.workflowDefinitionRepository.create(args);
  }

  async getWorkflowRuntimeDataById(
    id: string,
    args?: Parameters<WorkflowRuntimeDataRepository['findById']>[1],
  ) {
    return await this.workflowRuntimeDataRepository.findById(id, args);
  }

  async getWorkflowDefinitionById(
    id: string,
    args?: Parameters<WorkflowDefinitionRepository['findById']>[1],
  ) {
    return await this.workflowDefinitionRepository.findById(id, args);
  }

  async listActiveWorkflowsRuntimeStates() {
    return await this.workflowRuntimeDataRepository.findMany({
      select: {
        state: true,
        endUserId: true,
        id: true,
      },
    });
  }

  async listWorkflowRuntimeDataByUserId(userId: string) {
    return await this.workflowRuntimeDataRepository.findMany({
      where: { endUserId: userId },
    });
  }

  async listFullWorkflowDataByUserId(userId: string): Promise<CompleteWorkflowData[]> {
    return (await this.workflowRuntimeDataRepository.findMany({
      where: { endUserId: userId },
      include: { workflowDefinition: true },
    })) as CompleteWorkflowData[];
  }

  async listWorkflowDefinitions(args?: Parameters<WorkflowDefinitionRepository['findMany']>[0]) {
    return await this.workflowDefinitionRepository.findMany(args);
  }

  async updateWorkflowRuntimeData(workflowRuntimeId: string, data: WorkflowDefinitionUpdateInput) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(workflowRuntimeId);

    data.context = merge(runtimeData.context, data.context);

    this.logger.log(
      `Context update receivied from client: [${runtimeData.state} -> ${data.state} ]`,
    );

    const updateResult = await this.workflowRuntimeDataRepository.updateById(workflowRuntimeId, {
      data,
    });

    // TODO: Move to a separate method
    if (data.state) {
      // in case current state is a final state, we want to create another machine, of type manual review.
      // assign runtime to user, copy the context.
      const currentState = data.state;
      const workflow = await this.workflowDefinitionRepository.findById(
        runtimeData.workflowDefinitionId,
      );

      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        workflow.definition?.states?.[currentState]?.type === 'final' &&
        workflow.reviewMachineId
      ) {
        await this.handleRuntimeFinalState(runtimeData, data.context, workflow);
      }
    }

    return updateResult;
  }

  async deleteWorkflowDefinitionById(
    id: string,
    args?: Parameters<WorkflowDefinitionRepository['deleteById']>[1],
  ) {
    return await this.workflowDefinitionRepository.deleteById(id, args);
  }

  async handleRuntimeFinalState(
    runtime: WorkflowRuntimeData,
    context: Record<string, unknown>,
    workflow: WorkflowDefinition,
  ) {
    // discuss error handling
    if (!workflow.reviewMachineId) {
      return;
    }

    // will throw exception if review machine def is missing
    await this.workflowDefinitionRepository.findById(workflow.reviewMachineId);

    const workflowRuntimeDataExists = await this.workflowRuntimeDataRepository.findOne({
      where: {
        endUserId: runtime.endUserId,
        context: {
          path: ['parentMachine', 'id'],
          equals: runtime.id,
        },
      },
    });

    if (!workflowRuntimeDataExists) {
      await this.workflowRuntimeDataRepository.create({
        data: {
          endUserId: runtime.endUserId,
          workflowDefinitionVersion: workflow.version,
          workflowDefinitionId: workflow.reviewMachineId,
          context: {
            ...context,
            parentMachine: {
              id: runtime.id,
            },
          },
          status: 'created',
        },
      });
    } else {
      await this.workflowRuntimeDataRepository.updateById(workflowRuntimeDataExists.id, {
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context: context as any,
        },
      });
    }

    await this.updateWorkflowRuntimeData(runtime.id, {
      ...((runtime.context as { resubmissionReason: string })?.resubmissionReason
        ? {
            endUserId: runtime.endUserId,
            workflowDefinitionVersion: workflow.version,
            workflowDefinitionId: workflow.reviewMachineId,
            context: {
              ...context,
              parentMachine: {
                id: runtime.id,
              },
            },
          }
        : {}),
      status: 'completed',
    });
  }

  async resolveIntent(
    intent: string,
    endUserId = 'ckkt3qnv40001qxtt7nmj9r2r', // TODO: remove default value
  ): Promise<RunnableWorkflowData[]> {
    const workflowDefinitionResolver = policies['signup'];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { workflowDefinitionId } = workflowDefinitionResolver({})[0]!; // TODO: implement logic for multiple workflows
    const workflowDefinition = await this.workflowDefinitionRepository.findById(
      workflowDefinitionId,
    );
    const workflowRuntimeData = await this.workflowRuntimeDataRepository.create({
      data: {
        endUser: {
          connect: {
            id: endUserId,
          },
        },
        workflowDefinitionVersion: workflowDefinition.version,
        context: {},
        status: 'created',
        workflowDefinition: {
          connect: {
            id: workflowDefinitionId,
          },
        },
      },
    });

    await this.endUserRepository.updateById(endUserId, {
      data: {
        state: EndUserState.PROCESSING,
      },
    });
    this.logger.log(`${endUserId} is now in state ${EndUserState.PROCESSING}`);
    this.logger.log(
      `Created workflow runtime data ${workflowRuntimeData.id}, for user ${endUserId}, with workflow ${workflowDefinitionId}, version ${workflowDefinition.version}`,
    );

    return [
      {
        workflowDefinition,
        workflowRuntimeData,
      },
    ];
  }

  async event({ name: type, resubmissionReason, id }: WorkflowEventInput & IObjectWithId) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(id);
    const workflow = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
    );

    const service = createWorkflow({
      // @ts-expect-error Should run workflow.definition through Zod to ensure a valid definition.
      definition: workflow.definition,
      // @ts-expect-error The SDK supports 'statechart-json' | 'bmpn-json', the DB expects a string.
      definitionType: workflow.definitionType,
      workflowContext: {
        machineContext: runtimeData.context,
        state: runtimeData.state,
      },
    });

    service.sendEvent({
      type,
    });

    const snapshot = service.getSnapshot();
    const currentState = snapshot.value;
    const context = snapshot.machine.context;
    const isFinal = snapshot.machine.states[currentState].type === 'final';

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.logger.log(
      `Workflow ${workflow.name}-${id}-v${workflow.version} state transiation [${runtimeData.state} -> ${currentState}]`,
    );

    // Will be received from the client
    const document = 'documentOne';

    if (type === 'resubmit') {
      switch (resubmissionReason) {
        case ResubmissionReason.BLURRY_IMAGE:
          await this.workflowRuntimeDataRepository.updateById(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            (runtimeData as any).context?.parentMachine?.id,
            {
              data: {
                state: 'document_photo',
                status: 'created',
                context: {
                  ...context,
                  [document]: {
                    ...context?.[document],
                    resubmissionReason,
                  },
                },
              },
            },
          );
          break;
        default:
          throw new BadRequestException(
            `Invalid resubmission reason ${resubmissionReason as string}`,
          );
      }
    }

    await this.updateWorkflowRuntimeData(runtimeData.id, {
      context,
      state: currentState,
      status: isFinal ? 'completed' : runtimeData.status,
    });

    if (!isFinal || (currentState !== 'approved' && currentState !== 'rejected')) {
      return;
    }

    await this.endUserRepository.updateById(runtimeData.endUserId, {
      data: {
        state: EndUserState[currentState.toUpperCase() as keyof typeof EndUserState],
      },
    });
  }
}
