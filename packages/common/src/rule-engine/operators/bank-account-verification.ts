import { z } from 'zod';

import { OPERATION } from './enums';
import { BaseOperator } from './helpers';
import { ValidationFailedError } from '../errors';
import { BankAccountVerificationParams } from './types';
import { BANK_ACCOUNT_VERIFICATION_COMMERCIAL_REQUEST_TYPE } from '../../consts';

type BankAccountRule = {
  ruleId: string;
  ruleScore: number;
};

// These rules are required in order to pass the bank account verification check
const requiredRules = ['CMM1069', 'CMM1048', 'CMM1053'];

export class BankAccountVerification extends BaseOperator<
  any,
  BankAccountVerificationParams,
  boolean
> {
  constructor() {
    super({
      operator: OPERATION.BANK_ACCOUNT_VERIFICATION,
    });
  }

  extractValue(data: unknown) {
    const bankAccountVerificationSchema = z
      .object({
        pluginsOutput: z.object({
          bankAccountVerification: z.object({
            data: z.object({
              responseHeader: z.object({
                requestType: z.literal(BANK_ACCOUNT_VERIFICATION_COMMERCIAL_REQUEST_TYPE),
              }),
              clientResponsePayload: z.object({
                decisionElements: z.array(z.record(z.string(), z.unknown())),
              }),
            }),
          }),
        }),
      })
      .transform(
        ({
          pluginsOutput: {
            bankAccountVerification: {
              data: {
                responseHeader: { requestType },
                clientResponsePayload: { decisionElements },
              },
            },
          },
        }) => ({
          requestType,
          rules: decisionElements
            .filter(element => !!element.rules)
            .flatMap(element => element.rules),
        }),
      );

    const result = bankAccountVerificationSchema.safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('Extract value', 'parsing failed', result.error);
    }

    const rulesResult = z
      .array(
        z.object({
          ruleId: z.string(),
          ruleScore: z.number(),
        }),
      )
      .safeParse(result.data.rules);

    if (!rulesResult.success) {
      throw new ValidationFailedError('Extract value', 'parsing failed', rulesResult.error);
    }

    const rules = rulesResult.data.filter(rule => requiredRules.includes(rule.ruleId));

    if (rules.length < 3) {
      throw new ValidationFailedError('Extract value', 'less than 3 rules');
    }

    return rules;
  }

  evaluate(dataValue: BankAccountRule[]): boolean {
    const isEmpty = dataValue.length === 0;
    const allRulesAreZero = dataValue.some(rule => rule.ruleScore !== 0);

    return isEmpty || allRulesAreZero;
  }
}

export const BANK_ACCOUNT_VERIFICATION = new BankAccountVerification();
