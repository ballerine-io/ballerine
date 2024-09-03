import groupBy from 'lodash.groupby';
import { TContext } from '../../utils';
import { RiskRulesPluginParams } from './types';
import { logger } from '../../logger';

export class RiskRulePlugin {
  public static pluginType = 'risk-rules';
  name: RiskRulesPluginParams['name'];
  rulesSource: RiskRulesPluginParams['rulesSource'];
  stateNames: RiskRulesPluginParams['stateNames'];
  action: RiskRulesPluginParams['action'];
  successAction: RiskRulesPluginParams['successAction'];
  errorAction: RiskRulesPluginParams['errorAction'];

  constructor(pluginParams: RiskRulesPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.rulesSource = pluginParams.rulesSource;
    this.action = pluginParams.action;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }

  async invoke(context: TContext) {
    try {
      logger.log('Risk Rules PLugin - Invoking', {
        context,
        name: this.name,
      });

      const rulesetResult = await this.action(context, this.rulesSource);

      const { riskScore, rulesResults } = this.calculateRiskScore(
        rulesetResult.filter(ruleResult => ruleResult.result.every(r => r.status === 'PASSED')),
      );

      const indicators = rulesResults
        .filter(rule => rule.result.every(result => result.status === 'PASSED'))
        .map(rule => {
          return {
            name: rule.indicator,
            riskLevel: rule.riskLevel,
            domain: rule.domain,
          };
        });

      const riskIndicatorsByDomain = groupBy(indicators, 'domain');

      logger.log('Risk Rules Plugin - Success', {
        name: this.name,
      });

      return {
        response: {
          riskScore,
          riskIndicatorsByDomain,
          rulesResults,
          success: true,
        },
        callbackAction: this.successAction,
      } as const;
    } catch (error) {
      logger.error(`Risk Rules Plugin - Failed`, {
        context,
        name: this.name,
        databaseId: this.rulesSource.databaseId,
        source: this.rulesSource.source,
      });

      return {
        callbackAction: this.errorAction,
        error: error,
        success: false,
      } as const;
    }
  }

  calculateRiskScore(rulesetResult: Awaited<ReturnType<typeof this.action>>) {
    if (!rulesetResult || rulesetResult.length === 0) {
      return {
        riskScore: 0,
        rulesResults: rulesetResult,
      };
    }

    const [highestBaseIRuleViolation, ...restRuleViolations] = rulesetResult.sort(
      (a, b) => b.baseRiskScore - a.baseRiskScore,
    );

    const baseRiskScore = highestBaseIRuleViolation!.baseRiskScore;
    const overallRiskScore = restRuleViolations.reduce((sum, rule) => {
      sum += rule.additionalRiskScore;

      return sum;
    }, baseRiskScore);

    return {
      riskScore: overallRiskScore,
      rulesResults: rulesetResult,
    };
  }
}
