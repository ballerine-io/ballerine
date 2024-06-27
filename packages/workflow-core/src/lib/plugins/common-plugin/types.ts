import { TContext, Transformers } from '../../utils';
import { SerializableValidatableTransformer } from '../external-plugin';
import { ChildPluginCallbackOutput } from '../../types';
import { AnyRecord, RuleResultSet, RuleSet, TFindAllRulesOptions } from '@ballerine/common';
import { RiskRuleEvaluationable } from '@/lib/workflow-runner';

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
  source: 'notion';
  databaseId: string;

  invoke?(...args: any[]): Promise<any>;
}

export interface IterativePluginParams {
  name: string;
  stateNames: string[];
  iterateOn: Transformers;
  action: (context: TContext) => Promise<any>;
  successAction?: string;
  errorAction?: string;
}

type RuleSetOptions = { databaseId: string };
export interface RiskRulesPluginParams {
  name: string;
  databaseId: string;
  source: 'notion';
  stateNames: string[];
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
