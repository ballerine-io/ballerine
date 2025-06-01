import { ValidationFailedError } from '../errors';
import { OPERATION } from './enums';
import { BaseOperator } from './helpers';
import { z } from 'zod';
import { BankAccountVerificationParams } from './types';

type BankAccountRule = {
  ruleId: string;
  ruleName?: string;
  ruleText?: string;
  ruleScore: number;
};

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
                requestType: z.string(),
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

    if (result.data.requestType !== 'BAVCommercial-Standard') {
      return [];
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

    const rules = rulesResult.data.filter(rule =>
      ['CMM1069', 'CMM1048', 'CMM1052'].includes(rule.ruleId),
    );

    if (rules.length < 3) {
      throw new ValidationFailedError('Extract value', 'less than 3 rules');
    }

    return rules;
  }

  evaluate(dataValue: BankAccountRule[]): boolean {
    return dataValue.length === 0 || dataValue.every(rule => rule.ruleScore === 0);
  }
}

export const BANK_ACCOUNT_VERIFICATION = new BankAccountVerification();
