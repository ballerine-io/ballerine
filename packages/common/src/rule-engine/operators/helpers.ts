import get from 'lodash.get';
import isEmpty from 'lodash.isempty';

import {
  AmlCheckParams,
  BetweenParams,
  ExistsParams,
  LastYearsParams,
  Primitive,
  TOperation,
  UboMismatchParams,
} from './types';

import { z, ZodSchema } from 'zod';
import { BetweenSchema, LastYearsSchema, PrimitiveArraySchema, PrimitiveSchema } from './schemas';

import { Rule } from '@/rule-engine';
import { EndUserAmlHitsSchema } from '@/schemas';
import { TWorkflowHelpers } from '@/types';
import { TUnifiedApiClient } from '.';
import { DataValueNotFoundError, ValidationFailedError } from '../errors';
import { OperationHelpers, OPERATORS_WITHOUT_PATH_COMPARISON } from './constants';

export abstract class BaseOperator<
  TDataValue = Primitive,
  TConditionValue = Primitive,
  TEvaluate = boolean | Promise<boolean>,
> {
  operator: string;
  conditionValueSchema?: ZodSchema<any>;
  dataValueSchema?: ZodSchema<any>;

  constructor(options: {
    operator: TOperation;
    conditionValueSchema?: ZodSchema<any>;
    dataValueSchema?: ZodSchema<any>;
  }) {
    const { operator, conditionValueSchema, dataValueSchema } = options;

    this.operator = operator;
    this.conditionValueSchema = conditionValueSchema;
    this.dataValueSchema = dataValueSchema;
  }

  abstract evaluate(
    dataValue: TDataValue,
    conditionValue: TConditionValue,
    options?: {
      unifiedApiClient?: TUnifiedApiClient;
      threshold?: number;
    },
  ): TEvaluate;

  extractValue(data: unknown, rule: Rule, options?: { helpers: TWorkflowHelpers }) {
    const value = get(data, rule.key || '');

    const isPathComparison =
      !OPERATORS_WITHOUT_PATH_COMPARISON.includes(
        rule.operator as (typeof OPERATORS_WITHOUT_PATH_COMPARISON)[number],
      ) &&
      'isPathComparison' in rule &&
      rule.isPathComparison;

    if (!isPathComparison) {
      if (value === undefined || value === null) {
        throw new DataValueNotFoundError(rule.key || '');
      }

      return value;
    }

    const comparisonValueAsPath = rule.value as string;

    const evaluatedComparisonValue = get(data, comparisonValueAsPath);

    if (evaluatedComparisonValue === undefined || evaluatedComparisonValue === null) {
      throw new DataValueNotFoundError(comparisonValueAsPath);
    }

    return { value, comparisonValue: evaluatedComparisonValue };
  }

  async execute(
    dataValue: TDataValue,
    conditionValue: TConditionValue,
    options?: {
      unifiedApiClient?: TUnifiedApiClient;
      threshold?: number;
    },
  ) {
    await this.validate({ dataValue, conditionValue });

    const result = await this.evaluate(dataValue, conditionValue, options);

    return result instanceof Promise ? await result : result;
  }

  async validate(args: { dataValue: unknown; conditionValue: unknown }) {
    if (this.conditionValueSchema) {
      await this.validateSchema(
        this.conditionValueSchema,
        args.conditionValue,
        `Invalid condition value`,
      );
    }

    if (this.dataValueSchema) {
      await this.validateSchema(this.dataValueSchema, args.dataValue, `Invalid data value`);
    }
  }

  async validateSchema(schema: ZodSchema<any>, value: unknown, message: string) {
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new ValidationFailedError(this.operator, message, result.error);
    }
  }
}

class Equals extends BaseOperator {
  constructor() {
    super({
      operator: 'EQUALS',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return dataValue === conditionValue;
  };
}

class NotEquals extends BaseOperator {
  constructor() {
    super({
      operator: 'NOT_EQUALS',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return dataValue !== conditionValue;
  };
}

class In extends BaseOperator<Primitive, Primitive[]> {
  constructor() {
    super({
      operator: 'IN',
      conditionValueSchema: PrimitiveArraySchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive[]) => {
    return conditionValue.includes(dataValue);
  };
}

class InCaseInsensitive extends BaseOperator<Primitive | Primitive[], Primitive[]> {
  constructor() {
    super({
      operator: 'IN_CASE_INSENSITIVE',
      dataValueSchema: z.union([PrimitiveSchema, PrimitiveArraySchema]),
      conditionValueSchema: PrimitiveArraySchema,
    });
  }

  evaluate = (dataValue: Primitive | Primitive[], conditionValue: Primitive[]) => {
    let lowercaseDataValue = Array.isArray(dataValue)
      ? dataValue.map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      : dataValue;

    if (typeof lowercaseDataValue === 'string') {
      lowercaseDataValue = lowercaseDataValue.toLowerCase();
    }

    return conditionValue.some(item => {
      const lowercasedItem = typeof item === 'string' ? item.toLowerCase() : item;

      const checkValue = (value: Primitive) => {
        if (typeof value === 'string') {
          return value.includes(lowercasedItem.toString());
        }

        return value === lowercasedItem;
      };

      if (Array.isArray(lowercaseDataValue)) {
        return lowercaseDataValue.some(checkValue);
      }

      return checkValue(lowercaseDataValue);
    });
  };
}

class NotIn extends BaseOperator<Primitive, Primitive[]> {
  constructor() {
    super({
      operator: 'NOT_IN',
      conditionValueSchema: PrimitiveArraySchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive[]) => {
    return !conditionValue.includes(dataValue);
  };
}

class GreaterThan extends BaseOperator {
  constructor() {
    super({
      operator: 'GT',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return dataValue > conditionValue;
  };
}

class LessThan extends BaseOperator {
  constructor() {
    super({
      operator: 'LT',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return dataValue < conditionValue;
  };
}

class GreaterThanOrEqual extends BaseOperator {
  equals: Equals;
  greaterThan: GreaterThan;

  constructor() {
    super({
      operator: 'GTE',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });

    this.equals = new Equals();
    this.greaterThan = new GreaterThan();
  }

  evaluate = async (dataValue: Primitive, conditionValue: Primitive) => {
    return (
      (await this.equals.execute(dataValue, conditionValue)) ||
      (await this.greaterThan.execute(dataValue, conditionValue))
    );
  };
}

class LessThanOrEqual extends BaseOperator {
  equals: Equals;
  lessThan: LessThan;

  constructor() {
    super({
      operator: 'LTE',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });

    this.equals = new Equals();
    this.lessThan = new LessThan();
  }

  evaluate = async (dataValue: Primitive, conditionValue: Primitive) => {
    return (
      (await this.equals.execute(dataValue, conditionValue)) ||
      (await this.lessThan.execute(dataValue, conditionValue))
    );
  };
}

class Between extends BaseOperator<Primitive, BetweenParams> {
  gte: GreaterThanOrEqual;
  lte: LessThanOrEqual;

  constructor() {
    super({
      operator: 'BETWEEN',
      conditionValueSchema: BetweenSchema,
      dataValueSchema: PrimitiveSchema,
    });
    this.gte = new GreaterThanOrEqual();
    this.lte = new LessThanOrEqual();
  }

  evaluate = async (dataValue: Primitive, conditionValue: BetweenParams) => {
    return (
      (await this.gte.execute(dataValue, conditionValue.min)) &&
      (await this.lte.execute(dataValue, conditionValue.max))
    );
  };
}

class LastYear extends BaseOperator<unknown, LastYearsParams> {
  constructor() {
    super({
      operator: 'LAST_YEAR',
      conditionValueSchema: LastYearsSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = (dataValue: unknown, conditionValue: LastYearsParams) => {
    if (typeof dataValue === 'string' || dataValue instanceof Date) {
      const date = new Date(dataValue);
      const yearsAgo = new Date();

      yearsAgo.setFullYear(yearsAgo.getFullYear() - conditionValue.years);
      yearsAgo.setHours(0, 0, 0, 0);

      return date >= yearsAgo;
    }

    throw new ValidationFailedError(this.operator, `Unsupported data type ${typeof dataValue}`);
  };
}

/*
  @deprecated - not in use
*/
class Exists extends BaseOperator<Primitive, ExistsParams> {
  constructor() {
    super({
      operator: 'EXISTS',
    });
  }

  evaluate = (dataValue: Primitive, conditionValue: ExistsParams) => {
    if (conditionValue.schema) {
      const result = conditionValue.schema.safeParse(dataValue);

      if (!result.success) {
        return false;
      }
    }

    return !isEmpty(dataValue);
  };
}

class AmlCheck extends BaseOperator<any, AmlCheckParams> {
  constructor() {
    super({
      operator: 'AML_CHECK',
    });
  }

  extractValue(data: unknown, rule: Rule) {
    const amlRule = rule as Extract<Rule, { operator: 'AML_CHECK' }>;

    const result = z.record(z.string(), z.any()).safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('extract', 'parsing failed', result.error);
    }

    const objData = result.data;

    const childWorkflows = objData.childWorkflows[amlRule.value.childWorkflowName];

    const childWorkflowKeys = childWorkflows ? Object.keys(childWorkflows || {}) : [];

    const hits: Array<z.infer<typeof EndUserAmlHitsSchema>> = childWorkflowKeys
      .map(workflowId => get(childWorkflows, `${workflowId}.result.vendorResult.aml.hits`))
      .flat(1)
      .filter(Boolean);

    if (isEmpty(hits)) {
      throw new DataValueNotFoundError(rule.key as string);
    }

    return hits.map(hit => get(hit, rule.key as string)).filter(Boolean);
  }

  evaluate = async (dataValue: any, conditionValue: AmlCheckParams) => {
    const amlOperator = OperationHelpers[conditionValue.operator];

    const evaluateOperatorCheck = (data: any) => {
      const result = amlOperator.dataValueSchema?.safeParse(data);

      if (result && !result.success) {
        return false;
      }

      const conditionResult = amlOperator.conditionValueSchema?.safeParse(conditionValue.value);

      if ((conditionResult && !conditionResult.success) || !conditionResult?.data) {
        return false; // TODO: throw explicit error
      }

      return amlOperator.execute(data, conditionResult.data);
    };

    if (dataValue && Array.isArray(dataValue)) {
      return dataValue.some(evaluateOperatorCheck);
    } else {
      return evaluateOperatorCheck(dataValue);
    }
  };
}

class FuzzyMatchScoreLt extends BaseOperator<Primitive, Primitive, Promise<boolean>> {
  constructor() {
    super({
      operator: 'FUZZY_MATCH_SCORE_LT',
      conditionValueSchema: PrimitiveSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate = async (
    dataValue: Primitive,
    conditionValue: Primitive,
    options: {
      unifiedApiClient: TUnifiedApiClient;
      threshold: number;
    },
  ) => {
    const threshold = options.threshold ?? 0;

    if (typeof threshold !== 'number' || threshold < 0 || threshold > 100) {
      throw new Error(`${this.operator}: Threshold must be a number between 0 and 100`);
    }

    const response = await options.unifiedApiClient.runEntityMatchingV2({
      entity1: dataValue.toString(),
      entity2: conditionValue.toString(),
      includeAnalysis: false,
    });

    if (!response?.data?.similarityScore && response?.data?.similarityScore !== 0) {
      throw new Error(`${this.operator}: Missing similarity score in response`);
    }

    return response.data.similarityScore < threshold;
  };
}

class UboMismatch extends BaseOperator<any, UboMismatchParams> {
  constructor() {
    super({
      operator: 'UBO_MISMATCH',
    });
  }

  extractValue(data: unknown): { collectionUbos: string[]; registryUbos: string[] } {
    try {
      const normalizedString = z.string().transform(name => name.toUpperCase().trim());
      const result = z
        .object({
          entity: z.object({
            data: z.object({
              additionalInfo: z.object({
                ubos: z.array(
                  z.object({
                    firstName: normalizedString,
                    lastName: normalizedString,
                  }),
                ),
              }),
            }),
          }),
          pluginsOutput: z.object({
            ubo: z.object({
              data: z.object({
                nodes: z
                  .array(
                    z.object({
                      data: z.object({
                        name: normalizedString,
                        type: z.string(),
                      }),
                    }),
                  )
                  .transform(nodes => nodes.filter(node => node.data.type === 'PERSON')),
              }),
            }),
          }),
        })
        .parse(data);

      return {
        collectionUbos: result.entity.data.additionalInfo.ubos
          .map(ubo => `${ubo.firstName} ${ubo.lastName}`)
          .sort(),
        registryUbos: result.pluginsOutput.ubo.data.nodes.map(node => node.data.name).sort(),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationFailedError('extract', 'parsing failed', error);
      }

      throw error;
    }
  }

  evaluate = (data: { collectionUbos: string[]; registryUbos: string[] }): boolean => {
    const { collectionUbos, registryUbos } = data;
    const exactMatch =
      collectionUbos.length === registryUbos.length &&
      collectionUbos.every((name, index) => name === registryUbos[index]);

    return !exactMatch;
  };
}

export const EQUALS = new Equals();
export const NOT_EQUALS = new NotEquals();
export const EXISTS = new Exists();
export const GT = new GreaterThan();
export const LT = new LessThan();
export const GTE = new GreaterThanOrEqual();
export const LTE = new LessThanOrEqual();
export const BETWEEN = new Between();
export const LAST_YEAR = new LastYear();
export const IN = new In();
export const IN_CASE_INSENSITIVE = new InCaseInsensitive();
export const NOT_IN = new NotIn();
export const AML_CHECK = new AmlCheck();
export const FUZZY_MATCH_SCORE_LT = new FuzzyMatchScoreLt();
export const UBO_MISMATCH = new UboMismatch();

export {
  AmlCheck,
  Between,
  Equals,
  Exists,
  FuzzyMatchScoreLt,
  GreaterThan,
  GreaterThanOrEqual,
  In,
  InCaseInsensitive,
  LastYear,
  LessThan,
  LessThanOrEqual,
  NotEquals,
  NotIn,
};
