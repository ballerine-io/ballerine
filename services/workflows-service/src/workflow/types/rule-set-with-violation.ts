import { TRulesetGroup } from '@/workflow/types/ruleset-group';

export type RuleSetWithViolation = TRulesetGroup & {
  id: string;
  name: string;
  domain: string;
  baseRiskScore: number;
  additionRiskScore?: number;
  transactionLaunderingRisk?: number;
  chargebackRisk?: number;
  legalRisk?: number;
  reputationRisk?: number;
};
