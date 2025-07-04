import { z } from 'zod';
import { DocumentValidator, DocumentValidatorParamsSchema } from './validators/document';
import { FormatValidator, FormatValidatorParamsSchema } from './validators/format';
import { FutureDateValidator, FutureDateValidatorParamsSchema } from './validators/future-date';
import { MaxLengthValidator, MaxLengthValidatorParamsSchema } from './validators/max-length';
import { MaximumValidator, MaximumValidatorParamsSchema } from './validators/maximum';
import { MinLengthValidator, MinLengthValidatorParamsSchema } from './validators/min-length';
import { MinimumAgeValidator, MinimumAgeValidatorParamsSchema } from './validators/minimum-age';
import { MinimumValidator, MinimumValidatorParamsSchema } from './validators/minimum';
import { PastDateValidator, PastDateValidatorParamsSchema } from './validators/past-date';
import { PatternValidator, PatternValidatorParamsSchema } from './validators/pattern';
import {
  DocumentSizeValidator,
  DocumentSizeValidatorParamsSchema,
} from './validators/document-size';
import { RequiredValidator, RequiredValidatorParamsSchema } from './validators/required';
import { ValidationRule } from './common';

export const Validators = z.union([
  DocumentSizeValidator,
  DocumentValidator,
  FormatValidator,
  FutureDateValidator,
  MaximumValidator,
  MaxLengthValidator,
  MinimumAgeValidator,
  MinimumValidator,
  MinLengthValidator,
  PastDateValidator,
  PatternValidator,
  RequiredValidator,
]);

export type TValidators = z.infer<typeof Validators>;

export const BaseValidatorSchema = z.object({
  type: Validators,
  message: z.string().optional(),
  applyWhen: ValidationRule.optional(),
  considerRequired: z.boolean().optional(),
  value: z.any().optional(),
});

export type TBaseValidatorSchema = z.infer<typeof BaseValidatorSchema>;

export const ValidatorSchema = z.discriminatedUnion('type', [
  BaseValidatorSchema.extend({
    type: DocumentSizeValidator,
    value: DocumentSizeValidatorParamsSchema.optional(),
  }),
  BaseValidatorSchema.extend({
    type: DocumentValidator,
    value: DocumentValidatorParamsSchema.optional(),
  }),
  BaseValidatorSchema.extend({
    type: FormatValidator,
    value: FormatValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: FutureDateValidator,
    value: FutureDateValidatorParamsSchema.optional(),
  }),
  BaseValidatorSchema.extend({
    type: MaximumValidator,
    value: MaximumValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: MaxLengthValidator,
    value: MaxLengthValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: MinimumAgeValidator,
    value: MinimumAgeValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: MinimumValidator,
    value: MinimumValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: MinLengthValidator,
    value: MinLengthValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: PastDateValidator,
    value: PastDateValidatorParamsSchema.optional(),
  }),
  BaseValidatorSchema.extend({
    type: PatternValidator,
    value: PatternValidatorParamsSchema,
  }),
  BaseValidatorSchema.extend({
    type: RequiredValidator,
    value: RequiredValidatorParamsSchema.optional(),
  }),
]);

export type TValidatorSchema = z.infer<typeof ValidatorSchema>;
