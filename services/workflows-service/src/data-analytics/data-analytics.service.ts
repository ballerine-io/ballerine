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

  async runInlineRule({ rule, options }: InlineRule) {
    const evaluateFn = this._evaluateNameToFunction[rule.name];
    if (!evaluateFn) {
      throw new Error(`No evaluation function found for rule name: ${rule.name}`);
    }

    return await evaluateFn(options);
  }

  async evaluateTransactionsAgainstDynamicRules({
    amountThreshold,
    amountBetween,
    direction = 'Inbound',
    excludedCounterpartyIds = [],
    paymentMethods = [],
    excludePaymentMethods = false,
    timeAmount = 7,
    timeUnit = 'days',
    groupByBusiness = false,
    groupByCounterparty = false,
    havingAggregate = AggregateType.SUM,
  }: TransactionsAgainstDynamicRulesType) {
    const conditions: Prisma.Sql[] = [];

    conditions.push(Prisma.sql`"transactionDirection"::text = ${direction}`);
    if (excludedCounterpartyIds.length) {
      conditions.push(
        Prisma.sql`AND "counterpartyOriginatorId" NOT IN (${Prisma.join(excludedCounterpartyIds)})`,
      );
    }
    if (paymentMethods.length) {
      const methodCondition = excludePaymentMethods ? `NOT IN` : `IN`;
      conditions.push(
        Prisma.sql`AND "paymentMethod"::text ${Prisma.raw(methodCondition)} (${Prisma.join(
          paymentMethods,
        )})`,
      );
    }

    if (amountBetween) {
      conditions.push(
        Prisma.sql`AND "transactionAmount" BETWEEN ${amountBetween.min} AND ${amountBetween.max}`,
      );
    }

    let intervatTime;
    switch (timeUnit) {
      case 'minutes':
        intervatTime = Prisma.sql`${timeAmount} minutes`;
        break;
      case 'hours':
        intervatTime = Prisma.sql`${timeAmount} hours`;
        break;
      case 'days':
        intervatTime = Prisma.sql`${timeAmount} days`;
        break;
      case 'weeks':
        intervatTime = Prisma.sql`${timeAmount} weeks`;
        break;
      case 'months':
        intervatTime = Prisma.sql`${timeAmount} months`;
        break;
      case 'years':
        intervatTime = Prisma.sql`${timeAmount} years`;
        break;
      default:
        intervatTime = Prisma.sql`${timeAmount} days`;
    }

    conditions.push(Prisma.sql`AND "transactionDate" >= CURRENT_DATE - INTERVAL '${intervatTime}'`);

    const whereClause = Prisma.join(conditions, ' ');
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
}
