import { BaseComponent } from "@common/base-component";
import {Rule} from "@utils/rule/type";

const deserializeRule = (rules: Array<Rule>, uiComponents: Array<BaseComponent>, ) => {
  switch (rule.engine) {
    case 'event':
      return rule.logic.map((elementEventRule) => {
        const {eventType, elementName} = elementEventRule;
        if (uiComponents.name == elementName){

        }
        return {
          engine: 'event',
          logic: {
            eventType,
            elementName,
          },
        };
      });
    case 'jmespath':
      return {
        engine: 'jmespath',
        logic: rule.logic,
      };
    case 'json-logic':
      return {
        engine: 'json-logic',
        logic: rule.logic,
      };
  }
}
