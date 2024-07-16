import { EndUserAmlHitsSchema } from './../../../../../services/workflows-service/src/end-user/end-user.schema';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';

import {
  ConditionFn,
  BetweenParams,
  LastYearsParams,
  ExistsParams,
  Primitive,
  TOperation,
  AmlCheckParams,
} from './types';

import { z, ZodSchema } from 'zod';
import {
  BaseOperationsValueSchema,
  BetweenSchema,
  LastYearsSchema,
  PrimitiveArraySchema,
  PrimitiveSchema,
} from './schemas';

import { ValidationFailedError, DataValueNotFoundError } from '../errors';
import { OperationHelpers } from './constants';
import { Rule } from '../rules/types';

export abstract class BaseOperator<T = Primitive> {
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

  abstract evaluate(dataValue: Primitive, conditionValue: T): boolean;

  extractValue(data: unknown, rule: Rule) {
    const value = get(data, rule.key);

    if (value === undefined || value === null) {
      throw new DataValueNotFoundError(rule.key);
    }

    return value;
  }

  execute(dataValue: Primitive, conditionValue: T): boolean {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
    return dataValue !== conditionValue;
  };
}

class In extends BaseOperator<Primitive[]> {
  constructor() {
    super({
      operator: 'IN',
      conditionValueSchema: PrimitiveArraySchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate: ConditionFn<Primitive[]> = (
    dataValue: Primitive,
    conditionValue: Primitive[],
  ): boolean => {
    return conditionValue.includes(dataValue);
  };
}

class NotIn extends BaseOperator<Primitive[]> {
  constructor() {
    super({
      operator: 'NOT_IN',
      conditionValueSchema: PrimitiveArraySchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate: ConditionFn<Primitive[]> = (
    dataValue: Primitive,
    conditionValue: Primitive[],
  ): boolean => {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
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

  evaluate: ConditionFn<Primitive> = (dataValue: Primitive, conditionValue: Primitive): boolean => {
    return (
      this.equals.execute(dataValue, conditionValue) ||
      this.lessThan.execute(dataValue, conditionValue)
    );
  };
}

class Between extends BaseOperator<BetweenParams> {
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

  evaluate: ConditionFn<BetweenParams> = (
    dataValue: Primitive,
    conditionValue: BetweenParams,
  ): boolean => {
    return (
      this.gte.execute(dataValue, conditionValue.min) &&
      this.lte.execute(dataValue, conditionValue.max)
    );
  };
}

class LastYear extends BaseOperator<LastYearsParams> {
  constructor() {
    super({
      operator: 'LAST_YEAR',
      conditionValueSchema: LastYearsSchema,
      dataValueSchema: PrimitiveSchema,
    });
  }

  evaluate: ConditionFn<LastYearsParams> = (
    dataValue: unknown,
    conditionValue: LastYearsParams,
  ): boolean => {
    if (typeof dataValue === 'string' || dataValue instanceof Date) {
      const date = new Date(dataValue);
      const yearsAgo = new Date();
      yearsAgo.setFullYear(yearsAgo.getFullYear() - conditionValue.years);

      return date >= yearsAgo;
    }

    throw new ValidationFailedError(this.operator, `Unsupported data type ${typeof dataValue}`);
  };
}

/*
  @deprecated - not in use
*/
class Exists extends BaseOperator<ExistsParams> {
  constructor() {
    super({
      operator: 'EXISTS',
    });
  }

  evaluate: ConditionFn<ExistsParams> = (
    dataValue: Primitive,
    conditionValue: ExistsParams,
  ): boolean => {
    if (conditionValue.schema) {
      const result = conditionValue.schema.safeParse(dataValue);

      if (!result.success) {
        return false;
      }
    }

    return !isEmpty(dataValue);
  };
}

class AmlCheck extends BaseOperator<AmlCheckParams> {
  constructor() {
    super({
      operator: 'AML_CHECK',
    });
  }

  extractValue(data: unknown, rule: Extract<Rule, { operator: 'AML_CHECK' }>) {
    const result = z.record(z.string(), z.any()).safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('extract', 'parsing failed', result.error);
    }

    const objData = result.data;

    const childWorkflows = objData.childWorkflows[rule.value.childWorkflowName];

    const childWorkflowKeys = childWorkflows ? Object.keys(childWorkflows || {}) : [];

    const hits: z.infer<typeof EndUserAmlHitsSchema>[] = childWorkflowKeys
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

  evaluate: ConditionFn<AmlCheckParams> = (
    dataValue: any,
    conditionValue: AmlCheckParams,
  ): boolean => {
    const amlOperator = OperationHelpers[conditionValue.operator];

    const evaluateOperatorCheck = (data: any) => {
      let result = amlOperator.dataValueSchema?.safeParse(data);

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
export const NOT_IN = new NotIn();
export const AML_CHECK = new AmlCheck();
