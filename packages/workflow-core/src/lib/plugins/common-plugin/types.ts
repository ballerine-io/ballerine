import { TContext, Transformers } from '../../utils';
import { SerializableValidatableTransformer } from '../external-plugin';
import { ChildPluginCallbackOutput, WorkflowTokenCallbackInput } from '../../types';
import { AnyRecord, RuleResultSet, RuleSet, TFindAllRulesOptions } from '@ballerine/common';

export interface ISerializableCommonPluginParams
  extends Omit<IterativePluginParams, 'action' | 'iterateOn'> {
  iterateOn: Omit<SerializableValidatableTransformer, 'schema'>['transform'];
  response: SerializableValidatableTransformer;
  actionPluginName: string;

  invoke?(...args: any[]): any;
}

export interface ISerializableMappingPluginParams
  extends Omit<
    IterativePluginParams,
    'action' | 'iterateOn' | 'iterateOn' | 'action' | 'successAction' | 'errorAction'
  > {
  transformers: Omit<SerializableValidatableTransformer, 'schema'>['transform'];
}

export interface ISerializableChildPluginParams
  extends Omit<ChildWorkflowPluginParams, 'action' | 'transformers' | 'parentWorkflowRuntimeId'> {
  pluginKind: string;
  transformers: Omit<SerializableValidatableTransformer, 'schema'>['transform'];

  invoke?(...args: any[]): Promise<any>;
}

export interface ISerializableRiskRulesPlugin {
  pluginKind: string;
  name: string;
  stateNames: string[];
  rulesSource: RiskRulesPluginParams['rulesSource'];

  invoke?(...args: any[]): Promise<any>;
}

export interface ISerializableWorkflowTokenPlugin {
  pluginKind: string;
  name: string;
  stateNames: string[];
  uiDefinitionId: WorkflowTokenPluginParams['uiDefinitionId'];
  expireInMinutes?: WorkflowTokenPluginParams['expireInMinutes'];
  successAction?: string;
  errorAction?: string;

  invoke?(...args: any[]): ReturnType<WorkflowTokenPluginParams['action']>;
}

export interface IterativePluginParams {
  name: string;
  stateNames: string[];
  iterateOn: Transformers;
  action: (context: TContext) => Promise<any>;
  successAction?: string;
  errorAction?: string;
}

export interface RiskRulesPluginParams {
  name: string;
  rulesSource: {
    source: 'notion';
    databaseId: string;
  };
  stateNames: string[];
  successAction?: string;
  errorAction?: string;
  action: (
    context: TContext,
    ruleOptions: TFindAllRulesOptions,
  ) => Promise<
    Array<{
      id: string;
      domain: string;
      indicator: string;
      riskLevel: 'critical' | 'moderate' | 'positive';
      baseRiskScore: number;
      additionalRiskScore: number;
      result: RuleResultSet;
      ruleset: RuleSet;
    }>
  >;

  invoke?(context: TContext): Promise<any>;
}

export interface ChildWorkflowPluginParams {
  name: string;
  parentWorkflowRuntimeId: string;
  parentWorkflowRuntimeConfig: AnyRecord;
  definitionId: string;
  stateNames?: string[];
  transformers?: Transformers;
  initEvent?: string;
  action: (childCallbackInput: ChildPluginCallbackOutput) => Promise<void>;
}

export interface WorkflowTokenPluginParams {
  name: string;
  uiDefinitionId: string;
  expireInMinutes?: number;
  stateNames: string[];
  action: (workflowTokenCallbackInput: WorkflowTokenCallbackInput) => Promise<{
    token: string;
    customerName: string;
    collectionFlowUrl: string;
    customerNormalizedName: string;
  }>;
  successAction?: string;
  errorAction?: string;
}
