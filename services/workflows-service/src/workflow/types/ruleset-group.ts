import { TRuleEngine } from '@ballerine/rules-engine-lib';

export type TCustomRulesetGroup = {
  ruleSets: Parameters<TRuleEngine>[];
};
export type TRulesetGroup = TCustomRulesetGroup;
