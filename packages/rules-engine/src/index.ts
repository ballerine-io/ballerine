import { JsonLogicRule } from "./lib/rule-engine";
import { TCreateRuleEngine } from "./lib/types";


export const createRuleEngine: TCreateRuleEngine = (options) => {
    return {
      logicRule: (rule: any) => {
        return new JsonLogicRule(rule);
      }
    }
}
