import { testRule } from '@/components/organisms/DynamicUI/rule-engines/utils/execute-rules';
import { TValidationParams, UIElementV2 } from '@/components/providers/Validator/types';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export class UIElement {
  constructor(readonly element: UIElementV2, readonly context: unknown, readonly stack: number[]) {}

  getId() {
    return this.formatId(this.element.id);
  }

  getOriginId() {
    return this.element.id;
  }

  isRequired() {
    const requiredParams = this.element.validation?.required;

    const applyRules = requiredParams?.applyWhen || [];

    if (applyRules.length) {
      const isShouldApplyRequired = applyRules.every(rule =>
        testRule(this.context as AnyObject, rule),
      );

      return Boolean(isShouldApplyRequired);
    } else {
      if (Array.isArray(this.element.validation?.required)) {
        return Boolean(this.element.validation?.required[0]);
      }

      return Boolean(this.element.validation?.required);
    }
  }

  private formatId(id: string) {
    return `${id}${this.stack.join('.')}`;
  }

  getValueDestination() {
    return this.formatValueDestination(this.element.valueDestination);
  }

  private formatValueDestination(valueDestination: string) {
    return this.formatValueAndApplyStackIndexes(valueDestination);
  }

  private formatValueAndApplyStackIndexes(value: string) {
    this.stack.forEach((stackValue, index) => {
      value = value.replace(`$${index}`, String(stackValue));
    });

    return value;
  }

  getValue() {
    const valueDestination = this.getValueDestination();

    return get(this.context, valueDestination);
  }

  getValidatorsParams() {
    const validatorKeys = Object.keys(this.element.validation || {});

    return validatorKeys.map(key => ({
      validator: key,
      params: this.element.validation[key as keyof UIElementV2['validation']] as TValidationParams,
    }));
  }
}
