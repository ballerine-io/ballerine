import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { GenericAsyncFunction, InlineRule, TransactionsAgainstDynamicRulesType } from './types';
import { AggregateType } from './consts';
import { Prisma } from '@prisma/client';

@Injectable()
export class DataAnalyticsService {
  private _evaluateNameToFunction: Record<string, GenericAsyncFunction> = {};

  constructor(protected readonly prisma: PrismaService) {
    this._evaluateNameToFunction[this.evaluateTransactionsAgainstDynamicRules.name] =
      this.evaluateTransactionsAgainstDynamicRules.bind(this);
  }

  async runInlineRule(projectId: string, inlineRule: InlineRule) {
    const evaluateFn = this._evaluateNameToFunction[inlineRule.fnName];

    if (!evaluateFn) {
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

    console.log('Executing query...\n', query.sql);
    console.log('With values:...\n', query.values);
    const results = await this.prisma.$queryRaw(query);

    console.log(results);
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
