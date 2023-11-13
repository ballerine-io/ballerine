import {search} from "jmespath";
import * as jsonLogic from "json-logic-js";

type TJmespathRule = {
  type: 'jmespath',
  options: {
    rule: string,
  },
}

export type TJsonLogicRule = {
  type: 'json-logic',
  options: {
    rule: Record<string, unknown>,
  },
}

export type TDefintionRules = TJmespathRule | TJsonLogicRule;

export const ruleValidator = ({type, options: {rule}}: TJmespathRule | TJsonLogicRule): void => {
  if(type === 'jmespath') {
    try {
      search({}, rule as string)
    }catch (ex){
      throw new Error(`Invalid jmespath rule: ${rule as string}`);
    }
  }

  if (type === 'json-logic') {
    try {
      jsonLogic.apply(
        rule,
        {},
      );
    } catch (ex) {
      throw new Error(`JSON logic rule is invalid ${JSON.stringify(rule)}`);
    }
  }
};
