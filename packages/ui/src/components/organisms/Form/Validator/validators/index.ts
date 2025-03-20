import { TBaseValidators, TValidator } from '../types';
import { documentValidator } from './document';
import { formatValidator } from './format';
import { futureDateValidator } from './future-date-validator';
import { maxLengthValidator } from './max-length';
import { maximumValueValidator } from './maximum';
import { minLengthValidator } from './min-length';
import { minimumValueValidator } from './minimum';
import { minimumAgeValueValidator } from './minimum-age';
import { pastDateValidator } from './past-date-validator';
import { patternValueValidator } from './pattern';
import { requiredValueValidator } from './required';

export const baseValidatorsMap: Record<TBaseValidators, TValidator<any, any>> = {
  required: requiredValueValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  pattern: patternValueValidator,
  minimum: minimumValueValidator,
  maximum: maximumValueValidator,
  format: formatValidator,
  document: documentValidator,
  minimumAge: minimumAgeValueValidator,
  futureDate: futureDateValidator,
  pastDate: pastDateValidator,
};

export const validatorsExtends: Record<string, TValidator<any, any>> = {};
