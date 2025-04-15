import get from 'lodash.get';
import { z } from 'zod';

import { Rule } from '@/rule-engine';
import { CompanySanctionsCategoriesParams } from './types';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';
import { BaseOperator } from './helpers';
import { CompanySanctionsCategoriesSchema } from './schemas';
import { OPERATION } from './enums';

class CompanySanctionsCategories extends BaseOperator<string[], CompanySanctionsCategoriesParams> {
  constructor() {
    super({
      operator: OPERATION.COMPANY_SANCTIONS_CATEGORIES,
      conditionValueSchema: CompanySanctionsCategoriesSchema,
    });
  }

  extractValue(data: unknown, rule: Rule) {
    const companySanctionsSchema = z.object({
      pluginsOutput: z.object({
        companySanctions: z.object({
          data: z
            .array(
              z.object({
                entity: z
                  .object({
                    sources: z
                      .array(
                        z.object({
                          categories: z.array(z.string()),
                        }),
                      )
                      .optional(),
                  })
                  .optional(),
              }),
            )
            .optional(),
        }),
      }),
    });

    const result = companySanctionsSchema.safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('Extract value', 'parsing failed', result.error);
    }

    const objData = result.data;

    const companySanctions = get(objData, 'pluginsOutput.companySanctions.data');

    if (!companySanctions) {
      throw new DataValueNotFoundError('pluginsOutput.companySanctions.data');
    }

    const sourceCategories: string[] = [];

    companySanctions.forEach(
      (sanction: { entity?: { sources?: Array<{ categories?: string[] }> } }) => {
        if (sanction?.entity?.sources) {
          sanction.entity.sources.forEach((source: { categories?: string[] }) => {
            if (source?.categories && Array.isArray(source.categories)) {
              source.categories.forEach((category: string) => {
                sourceCategories.push(category);
              });
            }
          });
        }
      },
    );

    return sourceCategories;
  }

  evaluate(dataValue: string[], conditionValue: CompanySanctionsCategoriesParams): boolean {
    if (!dataValue || dataValue.length === 0) {
      return false;
    }

    const threshold = conditionValue?.threshold || 1;

    const categoryCount = dataValue.filter(
      category =>
        typeof category === 'string' &&
        category.toLowerCase() === conditionValue.category.toLowerCase(),
    ).length;

    return categoryCount >= threshold;
  }
}

export const COMPANY_SANCTIONS_CATEGORIES = new CompanySanctionsCategories();
