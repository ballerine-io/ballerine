import { CustomRuleEngine } from '@/lib/custom-rule-engine';
import { JMESPathRuleEngine } from '@/lib/jmespath-rule-engine';

export type TCustomerRuleEngineParams = { provider: 'custom' } & Parameters<
  typeof CustomRuleEngine
>[0];
export type TJEMSPathRuleEngineParams = { provider: 'jmespath' } & Parameters<
  typeof JMESPathRuleEngine
>[0];

export type TRuleEngine = (input: TCustomerRuleEngineParams | TJEMSPathRuleEngineParams) => boolean;
