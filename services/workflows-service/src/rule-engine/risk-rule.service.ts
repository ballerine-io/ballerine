import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { NotionService } from '@/notion/notion.service';
import z from 'zod';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { RuleSetSchema } from '@ballerine/common';
import { RiskRulePolicyService } from '@/risk-rules/risk-rule-policy/risk-rule-policy.service';

const isJsonString = (value: string) => {
  try {
    JSON.parse(value);

    return true;
  } catch (e) {
    return false;
  }
};

const NotionRiskRuleRecordSchema = z
  .object({
    ID: z.string().min(1),
    'Rule set': z
      .string()
      .refine(isJsonString, 'Not a valid JSON string')
      .transform(value => JSON.parse(value))
      .pipe(RuleSetSchema),
    Domain: z.string().min(1),
    Indicator: z.string().min(1),
    'Risk level': z.enum(['positive', 'moderate', 'critical']),
    'Base risk score': z.number().min(0).max(100),
    'Additional risk score': z.number().min(0).max(100),
    'Min risk score': z.number().min(0).max(100),
    'Max risk score': z.number().min(0).max(100),
  })
  .transform(value => ({
    id: value.ID,
    ruleSet: value['Rule set'],
    domain: value.Domain,
    indicator: value.Indicator,
    baseRiskScore: value['Base risk score'],
    additionalRiskScore: value['Additional risk score'],
    minRiskScore: value['Min risk score'],
    maxRiskScore: value['Max risk score'],
  }));

export type TFindAllRulesOptions =
  | {
      databaseId: string;
      source: 'notion';
    }
  | {
      databaseId: string;
      source: 'database';
    };

@Injectable()
export class RiskRuleService {
  constructor(
    private readonly notionService: NotionService,
    private readonly riskRulePolicyService: RiskRulePolicyService,
    private readonly logger: AppLoggerService,
  ) {}

  public async findAll(
    { databaseId, source }: TFindAllRulesOptions,
    options: {
      shouldThrowOnValidation: boolean;
      projectIds: string[];
    } = {
      shouldThrowOnValidation: false,
      projectIds: [],
    },
  ) {
    if (source === 'notion') {
      const records = await this.notionService.getAllDatabaseRecordsValues({
        databaseId,
      });

      const validatedRecords: Array<z.infer<typeof NotionRiskRuleRecordSchema>> = [];

      for (const record of records) {
        if (isEmpty(record.ID)) {
          continue;
        }

        const validatedRecord = NotionRiskRuleRecordSchema.safeParse(record);

        if (!validatedRecord.success) {
          this.logger.error(
            `Notion risk rule record schema validation failed\n Message: ${JSON.stringify(
              validatedRecord.error.format(),
              null,
              2,
            )}`,
            {
              databaseId,
              record,
              error: validatedRecord.error,
            },
          );

          if (options.shouldThrowOnValidation) {
            throw validatedRecord.error;
          }

          continue;
        }

        validatedRecords.push(validatedRecord.data);
      }

      return validatedRecords;
    } else if (source === 'database') {
      const riskRules = (
        await this.riskRulePolicyService.formatRiskRuleWithRules(databaseId, options.projectIds)
      ).filter(Boolean);

      return riskRules;
    }

    throw new Error('Unsupported source');
  }
}
