import get from 'lodash.get';
import isEmpty from 'lodash.isempty';

import {
  BetweenParams,
  LastYearsParams,
  ExistsParams,
  Primitive,
  TOperation,
  AmlCheckParams,
} from './types';

import { z, ZodSchema } from 'zod';
import { BetweenSchema, LastYearsSchema, PrimitiveArraySchema, PrimitiveSchema } from './schemas';

import { ValidationFailedError, DataValueNotFoundError } from '../errors';
import { OperationHelpers } from './constants';
import { Rule } from '@/rule-engine';
import { EndUserAmlHitsSchema } from '@/schemas';

export abstract class BaseOperator<TDataValue = Primitive, TConditionValue = Primitive> {
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

  abstract evaluate(dataValue: TDataValue, conditionValue: TConditionValue): boolean;

  extractValue(data: unknown, rule: Rule) {
    const value = get(data, rule.key);

    if (value === undefined || value === null) {
      throw new DataValueNotFoundError(rule.key);
    }

    return value;
  }

  execute(dataValue: TDataValue, conditionValue: TConditionValue) {
    this.validate({ dataValue, conditionValue });

    return this.evaluate(dataValue, conditionValue);
  }

  validate(args: { dataValue: unknown; conditionValue: unknown }) {
    if (this.conditionValueSchema) {
      this.validateSchema(
        this.conditionValueSchema,
        args.conditionValue,
        `Invalid condition value`,
      );
    }

    if (this.dataValueSchema) {
      this.validateSchema(this.dataValueSchema, args.dataValue, `Invalid data value`);
    }
  }

  validateSchema(schema: ZodSchema<any>, value: unknown, message: string) {
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

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return (
      this.equals.execute(dataValue, conditionValue) ||
      this.greaterThan.execute(dataValue, conditionValue)
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

  evaluate = (dataValue: Primitive, conditionValue: Primitive) => {
    return (
      this.equals.execute(dataValue, conditionValue) ||
      this.lessThan.execute(dataValue, conditionValue)
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

  evaluate = (dataValue: Primitive, conditionValue: BetweenParams) => {
    return (
      this.gte.execute(dataValue, conditionValue.min) &&
      this.lte.execute(dataValue, conditionValue.max)
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
      throw new DataValueNotFoundError(rule.key);
    }

    if (!Array.isArray(hits) || hits.length === 0) {
      return false;
    }

    return hits.map(hit => get(hit, rule.key)).filter(Boolean);
  }

  evaluate = (dataValue: any, conditionValue: AmlCheckParams) => {
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
