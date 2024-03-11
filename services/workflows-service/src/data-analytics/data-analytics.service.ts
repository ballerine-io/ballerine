import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  InlineRule,
  TransactionsAgainstDynamicRulesType,
  EvaluateFunctions,
  TAggregations,
  TCustomersTransactionTypeOptions,
} from './types';
import { AggregateType } from './consts';
import { PaymentMethod, Prisma, TransactionDirection, TransactionRecordType } from '@prisma/client';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class DataAnalyticsService {
  private _evaluateNameToFunction: Partial<{
    [K in keyof EvaluateFunctions]: EvaluateFunctions[K];
  }> = {};

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {
    this._evaluateNameToFunction[
      this.evaluateTransactionsAgainstDynamicRules.name as keyof EvaluateFunctions
    ] = this.evaluateTransactionsAgainstDynamicRules.bind(this);
  }

  async runInlineRule(projectId: string, inlineRule: InlineRule) {
    const evaluateFn = this._evaluateNameToFunction[inlineRule.fnName as keyof EvaluateFunctions];

    if (!evaluateFn) {
      this.logger.error(`No evaluation function found for rule name: ${inlineRule.id}`, {
        inlineRule,
      });

      throw new Error(`No evaluation function found for rule name: ${inlineRule.id}`);
    }

    return await evaluateFn({
      ...inlineRule.options,
      projectId,
    });
  }

  async evaluateTransactionsAgainstDynamicRules({
    projectId,
    amountThreshold,
    amountBetween,
    direction = 'inbound',
    excludedCounterpartyIds = [],
    paymentMethods = [],
    excludePaymentMethods = false,
    timeAmount = 7,
    timeUnit = 'days',
    groupByBusiness = false,
    groupByCounterparty = false,
    havingAggregate = AggregateType.SUM,
  }: TransactionsAgainstDynamicRulesType) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    const conditions: Prisma.Sql[] = [
      Prisma.sql`"projectId" = ${projectId}`,
      Prisma.sql`"transactionDirection"::text = ${direction}`,
      Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${this.getIntervalTime(
        timeUnit,
        timeAmount,
      )}'`,
    ];

    if (excludedCounterpartyIds.length) {
      const conditions = excludedCounterpartyIds
        .map(id => `counterpartyOriginatorId NOT LIKE '${id}'`)
        .join(' AND ');

      conditions.concat(conditions);
    }
    if (paymentMethods.length) {
      const methodCondition = excludePaymentMethods ? `NOT IN` : `IN`;

      conditions.push(
        Prisma.sql`"paymentMethod"::text ${Prisma.raw(methodCondition)} (${Prisma.join(
          paymentMethods,
        )})`,
      );
    }

    if (amountBetween) {
      conditions.push(
        Prisma.sql`"transactionAmount" BETWEEN ${amountBetween.min} AND ${amountBetween.max}`,
      );
    }

    // build conditional select, businessId alone, counterpartyOriginatorId alone, or both
    let selectClause: Prisma.Sql;
    let groupByClause: Prisma.Sql;
    if (groupByBusiness) {
      selectClause = Prisma.sql`"businessId"`;
      conditions.push(Prisma.sql`"businessId" IS NOT NULL`);
      groupByClause = Prisma.raw(`"businessId"`);
    } else if (groupByCounterparty) {
      selectClause = Prisma.sql`"counterpartyOriginatorId"`;
      conditions.push(Prisma.sql`"counterpartyOriginatorId" IS NOT NULL`);
      groupByClause = Prisma.raw(`"counterpartyOriginatorId"`);
    } else {
      selectClause = Prisma.sql`"businessId", "counterpartyOriginatorId"`;
      groupByClause = Prisma.raw(`"businessId", "counterpartyOriginatorId"`);
      conditions.push(Prisma.sql`"businessId" IS NOT NULL`);
      conditions.push(Prisma.sql`"counterpartyOriginatorId" IS NOT NULL`);
    }

    const whereClause = Prisma.join(conditions, ' AND ');

    let havingClause = '';
    switch (havingAggregate) {
      case AggregateType.COUNT:
        havingClause = `${AggregateType.COUNT}(id)`;
        break;
      case AggregateType.SUM:
        havingClause = `${AggregateType.SUM}(tr."transactionBaseAmount")`;
        break;
      default:
        throw new Error(`Invalid aggregate type: ${havingAggregate}`);
    }

    let query: Prisma.Sql;
    if (havingAggregate === AggregateType.COUNT) {
      query = Prisma.sql`SELECT ${selectClause}, COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr 
WHERE ${whereClause} GROUP BY ${groupByClause} HAVING ${Prisma.raw(
        havingClause,
      )} > ${amountThreshold}`;
    } else {
      query = Prisma.sql`SELECT ${selectClause}, SUM(tr."transactionBaseAmount") AS "totalAmount" FROM "TransactionRecord" tr
WHERE ${whereClause} GROUP BY ${groupByClause}`;
    }

    return await this._executeQuery(query);
  }

  async evaluatePaymentUnexpected({
    projectId,
    factor = 2,
    customerExpectedAmount = 0,
  }: {
    projectId: string;
    factor?: number;
    customerExpectedAmount?: number;
  }) {
    // TODO: get the customer expected amount from the customer's config
    let conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = ${projectId}`,
      Prisma.sql`jsonb_exists(config, 'customer_expected_amount') AND ((config ->> 'customer_expected_amount')::numeric * ${factor}) != ${customerExpectedAmount}`,
      Prisma.sql`tr."transactionAmount" > (config ->> 'customer_expected_amount')::numeric`,
    ];

    let query: Prisma.Sql = Prisma.sql`SELECT tr."businessId" , tr."transactionAmount" FROM "TransactionRecord" as tr
    WHERE ${Prisma.join(conditions, ' AND ')} `;

    const results = await this.prisma.$queryRaw(query);

    return results;
  }

  async evaluateDormantAccount({ projectId }: { projectId: string }) {
    const _V1: Prisma.Sql = Prisma.sql`SELECT 
    "totalTrunsactionAllTime"."businessId",
    "totalTrunsactionAllTime"."totalTrunsactionAllTime",
    "totalTransactionWithinSixMonths"."totalTransactionWithinSixMonths"
  FROM
    (
        SELECT
            "tr"."businessId",
            COUNT(tr."id") AS "totalTrunsactionAllTime"
        FROM
            "TransactionRecord" AS "tr"
        WHERE 
          tr."projectId" = '${projectId}'
          AND tr."businessId" IS NOT NULL
        GROUP BY
            tr."businessId"
        HAVING COUNT(tr."id") > 1
    ) AS "totalTrunsactionAllTime"
  JOIN
    (
        SELECT
            "tr"."businessId",
            COUNT("tr"."id") AS "totalTransactionWithinSixMonths"
        FROM
            "TransactionRecord" AS "tr"
        WHERE
            tr."projectId" = '${projectId}'
            AND tr."businessId" IS NOT NULL
            AND "transactionDate" >= CURRENT_DATE - INTERVAL '180 days'
        GROUP BY
            tr."businessId"
        HAVING COUNT(tr."id") = 1
    ) AS "totalTransactionWithinSixMonths"
  ON "totalTrunsactionAllTime"."businessId" = "totalTransactionWithinSixMonths"."businessId";`;

    const query: Prisma.Sql = Prisma.sql`
    SELECT
    tr."businessId",
    COUNT(
      CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '1 days' THEN
        tr."id"
      END) AS "totalTransactionWithinSixMonths",
    COUNT(tr."id") AS "totalTrunsactionAllTime"
  FROM
    "TransactionRecord" AS tr
  WHERE
    tr."projectId" = '${projectId}'
    AND tr."businessId" IS NOT NULL
  GROUP BY
    tr."businessId"
  HAVING
    COUNT(
      CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '1 days' THEN
        tr."id"
      END) = 1
    AND COUNT(tr."id") > 1;  
  `;

    return await this._executeQuery(query);
  }

  async evaluateCustomersTransactionType({
    projectId,
    transactionType,
    threshold = 5_000,
    paymentMethods = [],
    timeAmount = 7,
    timeUnit = 'days',
    isPerBrand = false,
    havingAggregate = AggregateType.SUM,
  }: TCustomersTransactionTypeOptions) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    if (!Array.isArray(transactionType) || !transactionType.length) {
      throw new Error('transactionType is required');
    }

    let conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = '${projectId}'`,
      Prisma.sql`tr."businessId" IS NOT NULL`,
      // TODO: should we use equation instead of IN clause?
      Prisma.sql`tr."transactionType" IN (${Prisma.join(
        transactionType.map(type => `'${type}'::"TransactionRecordType"`),
        ',',
      )})`,
      Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${this.getIntervalTime(
        timeUnit,
        timeAmount,
      )}'`,
    ];

    if (Array.isArray(paymentMethods.length)) {
      conditions.push(Prisma.sql`"paymentMethod" IN (${Prisma.join(paymentMethods)})`);
    }

    // High Velocity - Refund
    const groupBy = {
      clause: Prisma.join(
        [Prisma.raw(`tr."businessId"`), isPerBrand ? Prisma.raw(`paymentBrandName`) : Prisma.empty],
        ',',
      ),
    };

    let havingClause = '';
    switch (havingAggregate) {
      case AggregateType.COUNT:
        havingClause = `${AggregateType.COUNT}(id)`;
        break;
      case AggregateType.SUM:
        havingClause = `${AggregateType.SUM}(tr."transactionBaseAmount")`;
        break;
      default:
        throw new Error(`Invalid aggregate type: ${havingAggregate}`);
    }

    let query = Prisma.sql`
      SELECT ${groupBy.clause},
      FROM "TransactionRecord" as tr
      WHERE ${Prisma.join(conditions, ' AND ')}
      GROUP BY ${groupBy.clause}  HAVING ${Prisma.raw(havingClause)} > ${threshold}`;

    return await this._executeQuery(query);
  }

  private async _executeQuery(query: Prisma.Sql) {
    this.logger.log('Executing query...\n', {
      query: query.sql,
      values: query.values,
    });

    const results = await this.prisma.$queryRaw(query);

    this.logger.debug('evaluateTransactionsAgainstDynamicRules results', {
      results,
    });
    return results;
  }

  private getIntervalTime(timeUnit: string, timeAmount: number) {
    switch (timeUnit) {
      case 'minutes':
        return Prisma.sql`${timeAmount} minutes`;
        break;
      case 'hours':
        return Prisma.sql`${timeAmount} hours`;
        break;
      case 'days':
        return Prisma.sql`${timeAmount} days`;
        break;
      case 'weeks':
        return Prisma.sql`${timeAmount} weeks`;
        break;
      case 'months':
        return Prisma.sql`${timeAmount} months`;
        break;
      case 'years':
        return Prisma.sql`${timeAmount} years`;
        break;
      default:
        return Prisma.sql`${timeAmount} days`;
    }
  }
}
