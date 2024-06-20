import { Injectable } from '@nestjs/common';
import { NotionService } from '@/notion.service';
import z from 'zod';
import { deepCamelKeys } from 'string-ts';

const RuleSchema = z.object({
  field: z.string(),
  operation: z.enum(['equals', 'not_equals', 'contains', 'not_contains']),
  value: z.union([z.string(), z.number(), z.boolean()]),
  valueType: z.enum(['string', 'number', 'boolean', 'date', 'javascript']),
});

const RuleSetSchema = z.object({
  operator: z.enum(['and', 'or']),
  rules: z.array(RuleSchema),
});

const NotionRiskRuleRecordSchema = z
  .object({
    'Rule set': RuleSetSchema,
    Domain: z.string().min(1),
    Indicator: z.string().min(1),
    'Base risk score': z.number().min(0).max(100),
    'Additional risk score': z.number().min(0).max(100),
    'Min risk score': z.number().min(0).max(100),
    'Max risk score': z.number().min(0).max(100),
  })
  .transform(deepCamelKeys)
  .array();

type RiskRuleRecord = {
  ruleSet: {
    operator: 'and' | 'or';
    rules: Array<{
      field: string;
      operation: 'equals' | 'not_equals' | 'contains' | 'not_contains';
      value: string | number | boolean;
      valueType: 'string' | 'number' | 'boolean' | 'date' | 'javascript';
    }>;
  };
  domain: string;
  indicator: string;
  baseRiskScore: number;
  additionalRiskScore: number;
  minRiskScore: number;
  maxRiskScore: number;
};

@Injectable()
export class RiskRuleService {
  constructor(private readonly notionService: NotionService) {}

  public async findAll({
    databaseId,
    source,
  }: {
    databaseId: string;
    source: 'notion';
  }): Promise<RiskRuleRecord[]> {
    if (source === 'notion') {
      return await this.notionService.getAllDatabaseRecordsValues({
        databaseId,
        schema: NotionRiskRuleRecordSchema,
      });
    }

    throw new Error('Unsupported source');
  }
}
