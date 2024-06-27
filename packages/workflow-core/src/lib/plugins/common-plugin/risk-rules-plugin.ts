import { TContext } from '../../utils';
import { RiskRulesPluginParams } from './types';

export class RiskRulePlugin {
  public static pluginType = 'risk-rules';
  name: RiskRulesPluginParams['name'];
  databaseId: RiskRulesPluginParams['databaseId'];
  source: RiskRulesPluginParams['source'];
  stateNames: RiskRulesPluginParams['stateNames'];
  action: RiskRulesPluginParams['action'];
  constructor(pluginParams: RiskRulesPluginParams) {
    this.name = pluginParams.name;
    this.stateNames = pluginParams.stateNames;
    this.databaseId = pluginParams.databaseId;
    this.source = pluginParams.source;
    this.action = pluginParams.action;
  }

  async invoke(context: TContext) {
    try {
      const rulesetResult = await this.action(context, {
        source: this.source,
        databaseId: this.databaseId,
      });

      return this.calculateRiskScore(rulesetResult);
    } catch (error) {
      console.log(`Rules Plugin Failed`, {
        name: this.name,
        databaseId: this.databaseId,
        source: this.source,
      });

      return {
        riskScore: NaN,
        rulesResults: [],
        success: false,
      };
    }
  }

  calculateRiskScore(rulesetResult: Awaited<ReturnType<typeof this.action>>) {
    if (!rulesetResult || rulesetResult.length === 0) {
      return 0;
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
      success: true,
    };
  }
}
