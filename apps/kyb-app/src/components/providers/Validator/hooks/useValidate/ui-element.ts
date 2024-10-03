import { testRule } from '@/components/organisms/DynamicUI/rule-engines/utils/execute-rules';
import { formatValueDestinationAndApplyStackIndexes } from '@/components/providers/Validator/hooks/useValidate/utils/format-value-destination-and-apply-stack-indexes';
import { TValidationParams, UIElementV2 } from '@/components/providers/Validator/types';
import { IDocumentValueValidatorParams } from '@/components/providers/Validator/value-validators/document.value.validator';
import { IRequiredValueValidatorParams } from '@/components/providers/Validator/value-validators/required.value-validator';
import { fieldElelements } from '@/pages/CollectionFlowV2/renderer-schema';
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
    const requiredParams = this.element.validation?.required as IRequiredValueValidatorParams;
    const documentParams = this.element.validation?.document as IDocumentValueValidatorParams;

    const applyRules = requiredParams?.applyWhen || documentParams?.applyWhen || [];

    if (applyRules.length) {
      const isShouldApplyRequired = applyRules.every(rule =>
        testRule(this.context as AnyObject, rule),
      );

      return Boolean(isShouldApplyRequired);
    } else {
      return Boolean(requiredParams?.required) || Boolean(documentParams?.documentId);
    }
  }

  private formatId(id: string) {
    return `${id}${this.stack.join('.')}`;
  }

  getValueDestination() {
    return this.formatValueDestination(this.element.valueDestination);
  }

  private formatValueDestination(valueDestination: string) {
    return this.formatValueDestinationAndApplyStackIndexes(valueDestination);
  }

  private formatValueDestinationAndApplyStackIndexes(valueDestination: string) {
    return formatValueDestinationAndApplyStackIndexes(valueDestination, this.stack);
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

  getDefinition() {
    return this.element;
  }

  getFieldType() {
    if (this.element.element === 'fieldlist') return 'field-list';
    if (this.element.element in fieldElelements) return 'field';

    return 'ui';
  }
}
