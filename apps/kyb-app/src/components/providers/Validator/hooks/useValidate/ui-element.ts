import { UIElementV2 } from '@/components/providers/Validator/types';
import {
  IMaxLengthValueValidatorParams,
  MaxLengthValueValidator,
} from '@/components/providers/Validator/value-validators/max-length.value.validator';
import {
  IMinLengthValueValidatorParams,
  MinLengthValueValidator,
} from '@/components/providers/Validator/value-validators/min-length.value.validator';
import {
  IRequiredValueValidatorParams,
  RequiredValueValidator,
} from '@/components/providers/Validator/value-validators/required.value-validator';
import get from 'lodash/get';

export class UIElement {
  constructor(readonly element: UIElementV2, readonly context: unknown, readonly stack: number[]) {}

  getId() {
    return this.formatId(this.element.id);
  }

  getOriginId() {
    return this.element.id;
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
    const validatorKeys = Object.keys(this.element.validation);

    return validatorKeys.map(key => ({
      validator: key,
      params: this.getValidatorParams(key),
    }));
  }

  private getValidatorParams(key: string) {
    switch (key) {
      case 'minLength':
        return this.getMinLengthParams();
      case 'required':
        return this.getRequiredParams();
      case 'maxLength':
        return this.getMaxLengthParams();
      default:
        throw new Error('Invalid key');
    }
  }

  private getMinLengthParams(): IMinLengthValueValidatorParams {
    const _params = this.element.validation.minLength;

    if (MinLengthValueValidator.isMinLengthParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          minLength: _params[0],
          message: _params[1],
        };
      }

      const minLength = _params;

      const params: IMinLengthValueValidatorParams = {
        minLength,
        message: `Minimum length is ${minLength}.`,
      };

      return params;
    }

    throw new Error('Invalid params');
  }

  private getMaxLengthParams(): IMaxLengthValueValidatorParams {
    const _params = this.element.validation.maxLength;

    if (MaxLengthValueValidator.isMaxLengthParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          maxLength: _params[0],
          message: _params[1],
        };
      }

      const maxLength = _params;

      const params: IMaxLengthValueValidatorParams = {
        maxLength,
        message: `Maximum length is ${maxLength}.`,
      };

      return params;
    }

    throw new Error('Invalid params');
  }

  private getRequiredParams(): IRequiredValueValidatorParams {
    const _params = this.element.validation.required;

    if (RequiredValueValidator.isRequiredParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          required: _params[0],
          message: _params[1],
        };
      }

      const isRequired = _params;

      const params: IRequiredValueValidatorParams = {
        required: isRequired,
        message: `Value is required.`,
      };

      return params;
    }

    throw new Error('Invalid params');
  }
}
