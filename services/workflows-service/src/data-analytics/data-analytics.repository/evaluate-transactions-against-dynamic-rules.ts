import { PrismaClient, Prisma, TransactionDirection } from '@prisma/client';
import { Sql } from '@prisma/client/runtime';

const prisma = new PrismaClient();

export async function evaluateTransactionsAgainstDynamicRules({
  direction = 'Inbound',
  excludedCounterpartyIds = [],
  paymentMethods = [],
  excludePaymentMethods = false,
  days = 7,
  amountThreshold,
}: {
  direction?: TransactionDirection;
  excludedCounterpartyIds?: string[];
  paymentMethods?: string[];
  excludePaymentMethods?: boolean;
  days?: number;
  amountThreshold?: number;
}) {
  let conditions: Prisma.Sql[] = [];
  if (direction === 'Inbound') {
    conditions.push(Prisma.sql`"transactionDirection" = 'Inbound'`);
  } else {
    conditions.push(Prisma.sql`"transactionDirection" = 'Outbound'`);
  }
  if (excludedCounterpartyIds.length) {
    conditions.push(
      Prisma.sql`AND "counterpartyOriginatorId" NOT IN (${Prisma.join(excludedCounterpartyIds)})`,
    );
  }
  if (paymentMethods.length) {
    const methodCondition = excludePaymentMethods ? `NOT IN` : `IN`;
    conditions.push(
      Prisma.sql`AND "paymentMethod" ${Prisma.raw(methodCondition)} (${Prisma.join(
        paymentMethods,
      )})`,
    );
  }

  conditions.push(Prisma.sql`AND "transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'`);

  const whereClause = Prisma.join(conditions, ' ');

  let query: Sql;
  // if (amountThreshold !== undefined) {
  query = Prisma.sql`SELECT "counterpartyOriginatorId" , SUM("transactionAmount") AS "totalAmount" FROM "TransactionRecord" tr
WHERE ${whereClause} GROUP BY "counterpartyOriginatorId" HAVING SUM(tr."transactionBaseAmount") > ${amountThreshold}`;
  // }

  console.log(query);
  console.log('Executing query...', query.text);
  const results = await prisma.$queryRaw(query);

  console.log(results);
  return results;
}
