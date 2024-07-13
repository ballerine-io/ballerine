import { Injectable } from '@nestjs/common';
import { NotionService } from '@/notion/notion.service';
import z from 'zod';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { RuleSet, TOperation, TOperator } from '@ballerine/common';

const OPERATIONS = [
  'EQUALS',
  'NOT_EQUALS',
  'BETWEEN',
  'GT',
  'LT',
  'GTE',
  'LTE',
  'LAST_YEAR',
  'EXISTS',
  'IN',
  'NOT_IN',
] as const satisfies readonly TOperation[];

const OPERATORS = ['and', 'or'] as const satisfies readonly TOperator[];

const RuleSchema = z.object({
  key: z.string(),
  operation: z.enum(OPERATIONS),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

type Rule = z.infer<typeof RuleSchema>;

const RuleSetSchema: z.ZodType<RuleSet> = z.object({
  operator: z.enum(OPERATORS),
  rules: z.lazy(() => z.array(z.union([RuleSetSchema, RuleSchema]))),
});

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

export interface TFindAllRulesOptions {
  databaseId: string;
  source: 'notion';
}

@Injectable()
export class RiskRuleService {
  constructor(
    private readonly notionService: NotionService,
    private readonly logger: AppLoggerService,
  ) {}

  public async findAll({ databaseId, source }: TFindAllRulesOptions) {
    if (source === 'notion') {
      const records = await this.notionService.getAllDatabaseRecordsValues({
        databaseId,
      });

      const validatedRecords: z.infer<typeof NotionRiskRuleRecordSchema>[] = [];

      for (const record of records) {
        const validatedRecord = NotionRiskRuleRecordSchema.safeParse(record);

        if (!validatedRecord.success) {
          this.logger.error('Notion risk rule record schema validation failed', {
            databaseId,
            record,
            error: validatedRecord.error,
          });

          continue;
        }

        validatedRecords.push(validatedRecord.data);
      }

      return validatedRecords;
    }

    throw new Error('Unsupported source');
  }
}
