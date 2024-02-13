import { PrismaClient, Prisma, TransactionDirection, PaymentMethod } from '@prisma/client';
import { Sql } from '@prisma/client/runtime';

const prisma = new PrismaClient();

enum AggregateType {
  SUM = 'SUM',
  AVG = 'AVG',
  COUNT = 'COUNT',
  MAX = 'MAX',
  MIN = 'MIN',
}

export async function evaluateTransactionsAgainstDynamicRules({
  direction = 'Inbound',
  excludedCounterpartyIds = [],
  paymentMethods = [],
  excludePaymentMethods = false,
  timeAmount = 7,
  timeUnit = 'days',
  amountThreshold,
  amountBetween,
  groupByBusiness = false,
  groupByCounterparty = false,
  havingAggregate = AggregateType.SUM,
}: {
  havingAggregate?: AggregateType;
  amountBetween?: { min: number; max: number };
  timeAmount?: number;
  timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  direction?: TransactionDirection;
  excludedCounterpartyIds?: string[];
  paymentMethods?: PaymentMethod[];
  excludePaymentMethods?: boolean;
  days?: number;
  amountThreshold?: number;
  groupByBusiness?: boolean;
  groupByCounterparty?: boolean;
}) {
  let conditions: Prisma.Sql[] = [];

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
  let selectClause: Sql;
  let groupByClause: Sql;
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

  const aggregateFunction = Prisma.sql`${havingAggregate}(tr."transactionAmount")`;

  let query: Sql;
  if (havingAggregate === AggregateType.COUNT) {
    query = Prisma.sql`SELECT ${selectClause}, COUNT(id) AS "transactionCount" FROM "TransactionRecord" tr 
WHERE ${whereClause} GROUP BY ${groupByClause} HAVING COUNT(id) > ${amountThreshold}`;
  } else {
    query = Prisma.sql`SELECT ${selectClause}, SUM(tr."transactionBaseAmount") AS "totalAmount" FROM "TransactionRecord" tr
WHERE ${whereClause} GROUP BY ${groupByClause} HAVING SUM(tr."transactionBaseAmount") > ${amountThreshold}`;
  }

  console.log(query);
  console.log('Executing query...', query.text);
  const results = await prisma.$queryRaw(query);

  console.log(results);
  return results;
}
