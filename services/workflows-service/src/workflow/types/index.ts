import { SortOrder } from '@/common/query-filters/sort-order';
import { WorkflowRuntimeListItemModel } from '@/workflow/workflow-runtime-list-item.model';
import {
  Business,
  EndUser,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { User } from '@sentry/node';

export interface RunnableWorkflowData {
  workflowDefinition: WorkflowDefinition;
  workflowRuntimeData: WorkflowRuntimeData;
  ballerineEntityId?: string | null;
}

export type CompleteWorkflowData = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
};

export type TEntityType = 'endUser' | 'business';

export type TWorkflowWithRelations = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
  assignee: User;
  parentRuntimeId?: string;
  childWorkflowsRuntimeData?: Array<TWorkflowWithRelations>;
} & ({ endUser: EndUser } | { business: Business });

export interface ListWorkflowsRuntimeParams {
  page?: number;
  size?: number;
  status?: WorkflowRuntimeDataStatus[];
  orderBy?: string;
  orderDirection?: SortOrder;
}

export interface ListRuntimeDataResult {
  results: WorkflowRuntimeListItemModel[];
  meta: {
    pages: number;
    total: number;
  };
}

export type WorkflowRuntimeListQueryResult = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
  assignee: User | null;
};

export interface IWorkflowContextChangedEventData {
  eventName: 'workflow.context.changed';
  oldRuntimeData: WorkflowRuntimeData;
  updatedRuntimeData: WorkflowRuntimeData;
  state: string;
  entityId: string;
  correlationId: string;
}

export interface IWorkflowCompletedEventData {
  eventName: 'workflow.completed';
  // TODO: Move to a shared package
  runtimeData: WorkflowRuntimeData;
  state: string;
  entityId: string;
  correlationId: string;
}

export interface IWorkflowStateChangedEventData {
  eventName: 'workflow.state.changed';
  runtimeData: WorkflowRuntimeData;
  state: string;
  entityId: string;
  correlationId: string;
}

export type TWorkflowEventData =
  | IWorkflowContextChangedEventData
  | IWorkflowStateChangedEventData
  | IWorkflowCompletedEventData;

// eslint-disable-next-line @typescript-eslint/ban-types
export type TEventName = TWorkflowEventData['eventName'] | (string & {});

export type ExtractWorkflowEventData<TEvent extends TEventName> = Omit<
  Extract<
    TWorkflowEventData,
    {
      eventName: TEvent;
    }
  >,
  'eventName'
>;
