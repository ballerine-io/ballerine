import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DataAnalyticsRepository } from './data-analytics.repository';
import { InlineRule, TransactionsAgainstDynamicRulesType } from './types';
import { AggregateType } from './consts';
import { Prisma } from '@prisma/client';

@Injectable()
export class DataAnalyticsService {
  private _evaluateNameToFunction: Record<string, Function> = {
    [this.evaluateTransactionsAgainstDynamicRules.name]: async (
      options: TransactionsAgainstDynamicRulesType,
    ) => {
      await this.evaluateTransactionsAgainstDynamicRules(options);
    },
  };

  constructor(
    protected readonly prisma: PrismaService,
    private dataAnalyticsRepository: DataAnalyticsRepository,
  ) {}

  async runInlineRule(projectId: string, inlineRule: InlineRule) {
    const evaluateFn = this._evaluateNameToFunction[inlineRule.name];
    if (!evaluateFn) {
      throw new Error(`No evaluation function found for rule name: ${inlineRule.name}`);
    }

    return await evaluateFn(inlineRule.options);
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
      conditions.push(
        Prisma.sql`"counterpartyOriginatorId" NOT IN (${Prisma.join(excludedCounterpartyIds)})`,
      );
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

    const whereClause = Prisma.join(conditions, ' AND ');
    // build conditional select, businessId alone, counterpartyOriginatorId alone, or both
    let selectClause: Prisma.Sql;
    let groupByClause: Prisma.Sql;
    if (groupByBusiness) {
      selectClause = Prisma.sql`"businessId"`;
      groupByClause = Prisma.sql`"businessId"`;
    } else if (groupByCounterparty) {
      selectClause = Prisma.sql`"counterpartyOriginatorId"`;
      groupByClause = Prisma.sql`"counterpartyOriginatorId"`;
    } else {
      selectClause = Prisma.sql`"businessId", "counterpartyOriginatorId"`;
      groupByClause = Prisma.sql`"businessId", "counterpartyOriginatorId"`;
    }

    let havingClause: string = '';
    switch (havingAggregate) {
      case AggregateType.COUNT:
        havingClause = `${AggregateType}(id)`;
        break;
      case AggregateType.SUM:
        havingClause = `SUM(tr."transactionBaseAmount")`;
        break;
      default:
        throw new Error(`Invalid aggregate type: ${havingAggregate}`);
    }

    let query: Prisma.Sql;
    if (havingAggregate === AggregateType.COUNT) {
      query = Prisma.sql`SELECT ${selectClause}, COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr 
WHERE ${whereClause} GROUP BY ${groupByClause} $ > ${amountThreshold}`;
    } else {
      query = Prisma.sql`SELECT ${selectClause}, SUM(tr."transactionBaseAmount") AS "totalAmount" FROM "TransactionRecord" tr
WHERE ${whereClause} GROUP BY ${groupByClause} HAVING ${Prisma.raw(
        havingClause,
      )} > ${amountThreshold}`;
    }

    console.log(query);
    console.log('Executing query...', query.text);
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
