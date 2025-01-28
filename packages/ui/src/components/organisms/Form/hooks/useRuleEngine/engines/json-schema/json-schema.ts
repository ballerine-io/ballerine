import ajvErrors from 'ajv-errors';
import addFormats, { FormatName } from 'ajv-formats';
import Ajv from 'ajv/dist/2019';
import { IRule, TRuleEngine, TRuleEngineRunner } from '../../types';

const defaultFormats: FormatName[] = ['email', 'uri', 'date', 'date-time'];

export interface IJsonSchemaRuleEngineParams {
  formats?: FormatName[];
  keywords?: boolean;
  allErrors?: boolean;
  useDefaults?: boolean;
}

export const jsonSchemaEngineRunner: TRuleEngineRunner = (
  context: object,
  rule: IRule<TRuleEngine, IJsonSchemaRuleEngineParams>,
) => {
  if (!rule.value || typeof rule.value !== 'object') {
    throw new Error('JsonSchemaEngineRunner: Rule value must be an object');
  }

  const {
    formats = defaultFormats,
    allErrors = true,
    useDefaults = true,
    keywords = true,
  } = rule.params || {};

  const validator = new Ajv({ allErrors, useDefaults, validateFormats: false });
  addFormats(validator, { formats, keywords });
  ajvErrors(validator, { singleError: true });

  const isValid = validator.validate(rule.value, context);

  return Boolean(isValid);
};
