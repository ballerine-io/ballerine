import { TContext } from '../../utils';
import { RiskRulesPluginParams } from './types';

export class RiskRulePlugin {
  public static pluginType = 'risk-rules';
  name: RiskRulesPluginParams['name'];
  databaseId: RiskRulesPluginParams['databaseId'];
  source: RiskRulesPluginParams['source'];
  stateNames: RiskRulesPluginParams['stateNames'];
  action: RiskRulesPluginParams['action'];
  successAction: RiskRulesPluginParams['successAction'];
  errorAction: RiskRulesPluginParams['errorAction'];

  constructor(pluginParams: RiskRulesPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.databaseId = pluginParams.databaseId;
    this.source = pluginParams.source;
    this.action = pluginParams.action;
    this.successAction = pluginParams.successAction;
    this.errorAction = pluginParams.errorAction;
  }

  async invoke(context: TContext) {
    try {
      const rulesetResult = await this.action(context, {
        source: this.source,
        databaseId: this.databaseId,
      });

      const { riskScore, rulesResults } = this.calculateRiskScore(rulesetResult);

      const indicators = rulesResults
        .filter(rule =>
          rule.result.every(result => result.status === 'PASSED' || result.status === 'SKIPPED'),
        )
        .map(rule => {
          return {
            name: rule.indicator,
            riskLevel: rule.riskLevel,
          };
        });

      return {
        response: {
          riskScore,
          indicators,
          rulesResults,
          success: true,
        },
        callbackAction: this.successAction,
      } as const;
    } catch (error) {
      console.log(`Rules Plugin Failed`, {
        name: this.name,
        databaseId: this.databaseId,
        source: this.source,
      });

      return {
        callbackAction: this.errorAction,
        error: error,
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
