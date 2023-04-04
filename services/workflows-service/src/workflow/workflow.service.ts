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

import { Injectable, Logger } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { merge } from 'lodash';

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

    data.context = merge(data.context, runtimeData.context);

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
    _context: Record<string, unknown>,
    _workflow: WorkflowDefinition,
  ): Promise<void> {
    await this.updateWorkflowRuntimeData(runtime.id, {
      status: 'completed',
    });
  }

  async resolveIntent(
    intent: string,
    endUserId = 'ckkt3qnv40001qxtt7nmj9r2r', // TODO: remove default value
  ): Promise<RunnableWorkflowData[]> {
    const workflowDefinitionResolver = policies['signup'];
    // TODO: implement logic for multiple workflows
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { workflowDefinitionId } = workflowDefinitionResolver({})[0]!;
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

  async event({ name: type, id }: WorkflowEventInput & IObjectWithId) {
    const runtimeData = await this.workflowRuntimeDataRepository.findById(id);
    const workflow = await this.workflowDefinitionRepository.findById(
      runtimeData.workflowDefinitionId,
    );

    type CreateWorkflowArgs = Parameters<typeof createWorkflow>[0];
    const service = createWorkflow({
      definition: workflow.definition as unknown as CreateWorkflowArgs['definition'],
      definitionType: workflow.definitionType as CreateWorkflowArgs['definitionType'],
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
