import { TValidatorApplyRule, UIElementV2 } from '@/components/providers/Validator/types';
import {
  FormatValueValidator,
  IFormatValueValidatorParams,
} from '@/components/providers/Validator/value-validators/format.value.validator';
import {
  IMaxLengthValueValidatorParams,
  MaxLengthValueValidator,
} from '@/components/providers/Validator/value-validators/max-length.value.validator';
import {
  IMaximumValueValidatorParams,
  MaximumValueValidator,
} from '@/components/providers/Validator/value-validators/maximum.value.validator';
import {
  IMinLengthValueValidatorParams,
  MinLengthValueValidator,
} from '@/components/providers/Validator/value-validators/min-length.value.validator';
import {
  IMinimumValueValidatorParams,
  MinimumValueValidator,
} from '@/components/providers/Validator/value-validators/minimum.value.validator';
import {
  IPatternValidatorParams,
  PatternValueValidator,
} from '@/components/providers/Validator/value-validators/pattern.value.validator';
import {
  IRequiredValueValidatorParams,
  RequiredValueValidator,
} from '@/components/providers/Validator/value-validators/required.value-validator';
import jsonLogic from 'json-logic-js';
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

    const applyRule =
      Array.isArray(requiredParams) && requiredParams[2]
        ? (requiredParams[2] as TValidatorApplyRule)
        : null;

    if (applyRule) {
      const isShouldApplyRequired = jsonLogic.apply(applyRule, this.context);

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
      case 'pattern':
        return this.getPatternParams();
      case 'minimum':
        return this.getMinimumParams();
      case 'maximum':
        return this.getMaximumParams();
      case 'format':
        return this.getFormatParams();
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
          applyRule: _params[2],
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
          applyRule: _params[2],
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
          applyRule: _params[2],
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

  private getPatternParams() {
    const _params = this.element.validation.pattern;

    if (PatternValueValidator.isPatternParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          required: _params[0],
          message: _params[1],
          applyRule: _params[2],
        };
      }

      const pattern = _params;

      const params: IPatternValidatorParams = {
        pattern,
        message: `Value must match {pattern}.`,
      };

      return params;
    }

    throw new Error('Invalid params');
  }

  private getMinimumParams() {
    const _params = this.element.validation.minimum;

    if (MinimumValueValidator.isMinimumParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          required: _params[0],
          message: _params[1],
          applyRule: _params[2],
        };
      }

      const minimum = _params;

      const params: IMinimumValueValidatorParams = {
        minimum,
      };

      return params;
    }

    throw new Error('Invalid params');
  }

  private getMaximumParams() {
    const _params = this.element.validation.maximum;

    if (MaximumValueValidator.isMaximumParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          required: _params[0],
          message: _params[1],
          applyRule: _params[2],
        };
      }

      const maximum = _params;

      const params: IMaximumValueValidatorParams = {
        maximum,
      };

      return params;
    }

    throw new Error('Invalid params');
  }

  private getFormatParams() {
    const _params = this.element.validation.format;

    if (FormatValueValidator.isFormatParams(_params)) {
      if (Array.isArray(_params)) {
        return {
          required: _params[0],
          message: _params[1],
          applyRule: _params[2],
        };
      }

      const format = _params;

      const params: IFormatValueValidatorParams = {
        format,
      };

      return params;
    }

    throw new Error('Invalid params');
  }
}
