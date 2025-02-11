import { TBaseValidators, TValidator } from '../types';
import { formatValidator } from './format';
import { maxLengthValidator } from './max-length';
import { maximumValueValidator } from './maximum';
import { minLengthValidator } from './min-length';
import { minimumValueValidator } from './minimum';
import { patternValueValidator } from './pattern';
import { requiredValueValidator } from './required/required-validator';

export const baseValidatorsMap: Record<TBaseValidators, TValidator<any, any>> = {
  required: requiredValueValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  pattern: patternValueValidator,
  minimum: minimumValueValidator,
  maximum: maximumValueValidator,
  format: formatValidator,
};

export const validatorsExtends: Record<string, TValidator<any, any>> = {};
