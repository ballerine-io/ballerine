import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import { z } from 'zod';

import { Rule } from '@/rule-engine';
import { CompanySanctionsAdverseMediaParams } from './types';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';
import { BaseOperator } from './helpers';
import { CompanySanctionsAdverseMediaSchema } from './schemas';

class CompanySanctionsAdverseMedia extends BaseOperator<
  string[],
  CompanySanctionsAdverseMediaParams
> {
  constructor() {
    super({
      operator: 'COMPANY_SANCTIONS_ADVERSE_MEDIA',
      conditionValueSchema: CompanySanctionsAdverseMediaSchema,
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
            .min(1, 'Company sanctions data is required'),
        }),
      }),
    });

    const result = companySanctionsSchema.safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('extract', 'parsing failed', result.error);
    }

    const objData = result.data;

    // Get company sanctions data
    const companySanctions = get(objData, 'pluginsOutput.companySanctions.data');

    if (!companySanctions || isEmpty(companySanctions)) {
      throw new DataValueNotFoundError('pluginsOutput.companySanctions.data');
    }

    // Extract all source categories from company sanctions data
    const sourceCategories: string[] = [];

    // Traverse the data structure to find sources with "Adverse Media" category
    companySanctions.forEach(sanction => {
      if (sanction?.entity?.sources) {
        sanction.entity.sources.forEach(source => {
          if (source?.categories && Array.isArray(source.categories)) {
            source.categories.forEach(category => {
              sourceCategories.push(category);
            });
          }
        });
      }
    });

    return sourceCategories;
  }

  evaluate(dataValue: string[], conditionValue: CompanySanctionsAdverseMediaParams): boolean {
    if (!dataValue || dataValue.length === 0) {
      return false;
    }

    // Count occurrences of "Adverse Media" in source categories
    const adverseMediaCount = dataValue.filter(
      category => typeof category === 'string' && category.toLowerCase() === 'adverse media',
    ).length;

    // If there's a threshold defined, check if we meet that threshold
    const threshold = conditionValue?.threshold || 1;

    return adverseMediaCount >= threshold;
  }
}

export const COMPANY_SANCTIONS_ADVERSE_MEDIA = new CompanySanctionsAdverseMedia();
