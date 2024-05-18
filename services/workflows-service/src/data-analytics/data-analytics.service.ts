import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  InlineRule,
  TransactionsAgainstDynamicRulesType,
  TCustomersTransactionTypeOptions,
  HighTransactionTypePercentage,
  TPeerGroupTransactionAverageOptions,
  TDormantAccountOptions,
  HighVelocityHistoricAverageOptions,
} from './types';
import { AggregateType, TIME_UNITS } from './consts';
import { Prisma } from '@prisma/client';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isEmpty } from 'lodash';

@Injectable()
export class DataAnalyticsService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}

  async runInlineRule(projectId: string, inlineRule: InlineRule) {
    switch (inlineRule.fnName) {
      case 'evaluateHighTransactionTypePercentage':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });

      case 'evaluateTransactionsAgainstDynamicRules':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });

      case 'evaluateCustomersTransactionType':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });

      case 'evaluateTransactionAvg':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });

      case 'evaluateDormantAccount':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });

      case 'evaluateHighVelocityHistoricAverage':
        return await this[inlineRule.fnName]({
          ...inlineRule.options,
          projectId,
        });
    }

    this.logger.error(`No evaluation function found`, {
      inlineRule,
    });

    throw new Error(`No evaluation function found for rule name: ${(inlineRule as InlineRule).id}`);
  }

  async evaluateTransactionsAgainstDynamicRules({
    projectId,
    amountThreshold,
    amountBetween,
    direction,
    transactionType = [],
    excludedCounterparty = {
      counterpartyBeneficiaryIds: [],
      counterpartyOriginatorIds: [],
    },
    paymentMethods = [],
    excludePaymentMethods = false,
    timeAmount = 7,
    timeUnit = TIME_UNITS.days,
    groupBy = [],
    havingAggregate = AggregateType.SUM,
  }: TransactionsAgainstDynamicRulesType) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    if (!Array.isArray(groupBy) || groupBy.length === 0) {
      throw new Error('groupBy is required');
    }

    const conditions: Prisma.Sql[] = [
      Prisma.sql`"projectId" = ${projectId}`,
      Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
        `${timeAmount} ${timeUnit}`,
      )}'`,
    ];

    if (!isEmpty(transactionType)) {
      conditions.push(
        Prisma.sql`tr."transactionType"::text IN (${Prisma.join([...transactionType], ',')})`,
      );
    }

    if (direction) {
      conditions.push(Prisma.sql`"transactionDirection"::text = ${direction}`);
    }

    if (excludedCounterparty) {
      (excludedCounterparty.counterpartyBeneficiaryIds || []).forEach(id =>
        // @TODO: Check against correlationId
        conditions.push(Prisma.sql`"counterpartyBeneficiaryId" NOT LIKE ${id}`),
      );

      (excludedCounterparty.counterpartyOriginatorIds || []).forEach(id =>
        // @TODO: Check against correlationId
        conditions.push(Prisma.sql`"counterpartyOriginatorId" NOT LIKE ${id}`),
      );
    }

    if (paymentMethods.length) {
      const methodCondition = excludePaymentMethods ? `NOT IN` : `IN`;

      conditions.push(
        Prisma.sql`"paymentMethod"::text ${Prisma.raw(methodCondition)} (${Prisma.join([
          ...paymentMethods,
        ])})`,
      );
    }

    if (amountBetween) {
      conditions.push(
        Prisma.sql`"transactionAmount" BETWEEN ${amountBetween.min} AND ${amountBetween.max}`,
      );
    }

    // build conditional select, businessId alone, counterpartyOriginatorId alone, or both
    let selectClause: Prisma.Sql = Prisma.empty;
    let groupByClause: Prisma.Sql = Prisma.empty;

    if (groupBy) {
      try {
        selectClause = Prisma.join([
          ...groupBy
            .slice(0)
            .map(groupByField => [
              Prisma.sql`"${Prisma.raw(groupByField)}" as "counterpartyId"`,
              Prisma.sql`"${Prisma.raw(groupByField)}"`,
            ])
            .flat(),
          ...groupBy
            .slice(1, groupBy.length - 1)
            .map(groupByField => Prisma.sql`"${Prisma.raw(groupByField)}"`),
        ]);
      } catch (error) {
        this.logger.log('Error building clause', { error });
      }
      conditions.push(
        ...groupBy.map(groupByField => Prisma.sql`"${Prisma.raw(groupByField)}" IS NOT NULL`),
      );
      groupByClause = Prisma.join(
        groupBy.map(groupByField => Prisma.sql`"${Prisma.raw(groupByField)}"`),
        ',',
      );
    }

    const whereClause = Prisma.join(conditions, ' AND ');

    let havingClause = '';
    let query: Prisma.Sql;

    switch (havingAggregate) {
      case AggregateType.COUNT:
        havingClause = `${AggregateType.COUNT}(id)`;
        query = Prisma.sql`SELECT ${selectClause}, COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr WHERE ${whereClause} GROUP BY ${groupByClause} HAVING ${Prisma.raw(
          havingClause,
        )} > ${amountThreshold}`;
        break;
      case AggregateType.SUM:
        havingClause = `${AggregateType.SUM}(tr."transactionBaseAmount")`;
        query = Prisma.sql`SELECT ${selectClause}, SUM(tr."transactionBaseAmount") AS "totalAmount", COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr WHERE ${whereClause} GROUP BY ${groupByClause} HAVING ${Prisma.raw(
          havingClause,
        )} > ${amountThreshold}`;
        break;
      default:
        query = Prisma.sql`SELECT ${selectClause}, COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr WHERE ${whereClause} GROUP BY ${groupByClause}`;
    }

    return await this._executeQuery<Array<Record<string, unknown>>>(query);
  }

  async evaluateHighTransactionTypePercentage({
    projectId,
    transactionType,
    subjectColumn,
    minimumCount,
    minimumPercentage,
    timeAmount,
    timeUnit,
  }: HighTransactionTypePercentage) {
    // TODO: Optimize this query with HAVING c
    return await this._executeQuery<Array<{ counterpartyId: string }>>(Prisma.sql`
      WITH "transactionsData" AS (
        SELECT
          "${Prisma.raw(subjectColumn)}",
          COUNT(*) AS "transactionCount",
          COUNT(*) FILTER (WHERE "transactionType"::text = ${Prisma.sql`${transactionType}`}) AS "filteredTransactionCount"
        FROM
          "TransactionRecord"
        WHERE
          "projectId" = ${projectId}
          AND "transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
            `${timeAmount} ${timeUnit}`,
          )}'
        GROUP BY
          "${Prisma.raw(subjectColumn)}"
      )
      SELECT
        "${Prisma.raw(subjectColumn)}" AS "counterpartyId"
      FROM
        "transactionsData"
      WHERE
        "filteredTransactionCount" >= ${minimumCount}
        AND "filteredTransactionCount"::decimal / "transactionCount"::decimal * 100 >= ${minimumPercentage}
    `);
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
    const conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = ${projectId}`,
      Prisma.sql`jsonb_exists(config, 'customer_expected_amount') AND ((config ->> 'customer_expected_amount')::numeric * ${factor}) != ${customerExpectedAmount}`,
      Prisma.sql`tr."transactionAmount" > (config ->> 'customer_expected_amount')::numeric`,
    ];

    const query: Prisma.Sql = Prisma.sql`SELECT tr."businessId" , tr."transactionAmount" FROM "TransactionRecord" as "tr"
    WHERE ${Prisma.join(conditions, ' AND ')} `;

    const results = await this.prisma.$queryRaw(query);

    return results;
  }

  async evaluateDormantAccount({ projectId, timeAmount, timeUnit }: TDormantAccountOptions) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    const query: Prisma.Sql = Prisma.sql`
  WITH transactions AS (
    SELECT
      tr."counterpartyBeneficiaryId" AS "counterpartyId",
      count(
        CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
          `${timeAmount} ${timeUnit}`,
        )}' THEN
          tr."id"
        END) AS "totalTransactionWithinSixMonths",
      count(tr."id") AS "totalTransactionAllTime"
    FROM
      "TransactionRecord" AS "tr"
    WHERE 
      tr."projectId" = ${projectId}
      AND  tr."counterpartyBeneficiaryId" IS NOT NULL
    GROUP BY
      tr."counterpartyBeneficiaryId"
  )
  SELECT
    *
  FROM
    transactions
  WHERE
    "totalTransactionAllTime" > 1
    AND "totalTransactionWithinSixMonths" = 1;  
  `;

    return await this._executeQuery<Array<Record<string, unknown>>>(query);
  }

  async evaluateCustomersTransactionType({
    projectId,
    transactionType = [],
    threshold = 5_000,
    paymentMethods = [],
    timeAmount = 7,
    timeUnit = TIME_UNITS.days,
    isPerBrand = false,
    havingAggregate = AggregateType.SUM,
  }: TCustomersTransactionTypeOptions) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    if (!Array.isArray(transactionType) || !transactionType.length) {
      throw new Error('transactionType is required');
    }

    const conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = '${projectId}'`,
      Prisma.sql`tr."businessId" IS NOT NULL`,
      // TODO: should we use equation instead of IN clause?
      Prisma.sql`tr."transactionType"::text IN (${Prisma.join(transactionType, ',')})`,
      Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
        `${timeAmount} ${timeUnit}`,
      )}'`,
    ];

    if (Array.isArray(paymentMethods.length)) {
      conditions.push(Prisma.sql`"paymentMethod" IN (${Prisma.join([...paymentMethods])})`);
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

    const query = Prisma.sql`
      SELECT ${groupBy.clause},
      FROM "TransactionRecord" as "tr"
      WHERE ${Prisma.join(conditions, ' AND ')}
      GROUP BY ${groupBy.clause}  HAVING ${Prisma.raw(havingClause)} > ${threshold}`;

    return await this._executeQuery<Array<Record<string, unknown>>>(query);
  }

  async evaluateTransactionAvg({
    projectId,
    transactionDirection,
    paymentMethod,
    minimumCount,
    minimumTransactionAmount,
    transactionFactor,
    customerType,
    timeUnit,
    timeAmount,
  }: TPeerGroupTransactionAverageOptions) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    const conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = ${projectId}`,
      Prisma.sql`"transactionDirection"::text = ${transactionDirection}`,
      Prisma.sql`tr."paymentMethod"::text ${Prisma.raw(paymentMethod.operator)} ${
        paymentMethod.value
      }`,
      !!timeAmount &&
        !!timeUnit &&
        Prisma.sql`tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
          `${timeAmount} ${timeUnit}`,
        )}'`,
      !!customerType && Prisma.sql`b."businessType" = ${customerType}`,
    ].filter(Boolean);

    return await this._executeQuery<Array<{ counterpartyId: string }>>(
      Prisma.sql`
    WITH "transactionsData" AS (
      SELECT
        "counterpartyBeneficiaryId",
        COUNT(*) AS count,
        avg("transactionBaseAmount") AS avg
      FROM
        "TransactionRecord" tr ${
          customerType
            ? Prisma.sql`JOIN "Counterparty" AS cp ON tr."counterpartyBeneficiaryId" = cp.id
               JOIN "Business" AS b ON cp."businessId" = b.id`
            : Prisma.empty
        }
      WHERE
        ${Prisma.join(conditions, ' AND ')}
      GROUP BY
        "counterpartyBeneficiaryId"
      HAVING COUNT(*) > ${minimumCount}
    )
    SELECT
      tr."counterpartyBeneficiaryId" AS "counterpartyId"
    FROM
      "TransactionRecord" tr
      JOIN "transactionsData" td ON tr."counterpartyBeneficiaryId" = td."counterpartyBeneficiaryId"
    WHERE
      "transactionBaseAmount" > ${minimumTransactionAmount}
      AND "transactionBaseAmount" > (
        ${transactionFactor} * avg
      )
    GROUP BY
      tr."counterpartyBeneficiaryId";
      `,
    );
  }

  async evaluateHighVelocityHistoricAverage({
    projectId,
    transactionDirection,
    paymentMethod,
    minimumCount,
    transactionFactor,
    activeUserPeriod,
    lastDaysPeriod,
  }: HighVelocityHistoricAverageOptions) {
    if (!projectId) {
      throw new Error('projectId is required');
    }

    const lastLargePeriodClause = Prisma.sql`tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
      `${activeUserPeriod.timeAmount} ${activeUserPeriod.timeUnit}`,
    )}'`;

    const lastDaysPeriodClause = Prisma.sql`tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
      `${lastDaysPeriod.timeAmount} ${lastDaysPeriod.timeUnit}`,
    )}'`;

    const conditions: Prisma.Sql[] = [
      Prisma.sql`tr."projectId" = ${projectId}`,
      Prisma.sql`tr."counterpartyBeneficiaryId" IS NOT NULL`,
      Prisma.sql`tr."transactionDirection"::text = ${transactionDirection}`,
      Prisma.sql`tr."paymentMethod"::text ${Prisma.raw(paymentMethod.operator)} ${
        paymentMethod.value
      }`,
      lastLargePeriodClause,
    ];

    return await this._executeQuery<Array<{ counterpartyId: string }>>(
      Prisma.sql`
      SELECT
      "counterpartyBeneficiaryId",
      COUNT(id) FILTER (WHERE ${lastLargePeriodClause}) AS lasSixMonths,
      COUNT(id) FILTER (WHERE ${lastDaysPeriodClause}) AS lastDays
    FROM
      "TransactionRecord"
    WHERE
      ${Prisma.join(conditions, ' AND ')}
    GROUP BY
      "counterpartyBeneficiaryId"
    HAVING
      COUNT(id) FILTER (WHERE ${lastDaysPeriodClause}) > ${minimumCount} -- A condition that is used to ensure that we are calculating an average of active users
      AND COUNT(id) FILTER (WHERE ${lastDaysPeriodClause}) > -- AS lastDaysPeriod
      ((${transactionFactor} * COUNT(id) FILTER (WHERE ${lastLargePeriodClause}) -- AS lastLargePeriod
        - COUNT(id) FILTER (WHERE ${lastDaysPeriodClause})
    ) / 59);
      `,
    );

    // // TODO: extract count to a variable and resude in select + having section
    // return await this._executeQuery<Array<{ counterpartyId: string }>>(
    //   Prisma.sql`
    // WITH "transactionsData" AS (
    //   SELECT
    //     "counterpartyBeneficiaryId",
    //     COUNT(id) filter (where tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
    //       `${activeUserPeriod.timeAmount} ${activeUserPeriod.timeUnit}`,
    //     )}')as totalTransactionWithinSixMonths,
    //     COUNT(id) filter (where tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
    //       `${lastDaysPeriod.timeAmount} ${lastDaysPeriod.timeUnit}`,
    //     )}')as totalLastDays
    //   FROM
    //     "TransactionRecord" tr
    //   WHERE
    //     ${Prisma.join(conditions, ' AND ')}
    //   GROUP BY
    //     "counterpartyBeneficiaryId"
    //   HAVING COUNT(
    //     CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '${Prisma.raw(
    //       `${lastDaysPeriod.timeAmount} ${lastDaysPeriod.timeUnit}`,
    //     )}' THEN
    //       tr."id"
    //     END) > ${minimumCount} -- have to keep the filter of 180 rows
    // )
    // SELECT
    //   tr."counterpartyBeneficiaryId" AS "counterpartyId"
    // FROM
    //   "TransactionRecord" tr
    //   JOIN "transactionsData" td ON tr."counterpartyBeneficiaryId" = td."counterpartyBeneficiaryId"
    // WHERE

    // GROUP BY
    //   tr."counterpartyBeneficiaryId";
    //   `,
    // );
  }

  private async _executeQuery<T = unknown>(query: Prisma.Sql) {
    this.logger.log('Executing query...\n', {
      query: query.sql,
      values: query.values,
    });

    return await this.prisma.$queryRaw<T>(query);
  }
}
