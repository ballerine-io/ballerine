// evaluate-transaction-direction-and-counterparty-rule.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EvaluateTransactionDirectionAndCounterpartyRuleParams {
  direction: 'Inbound' | 'Outbound';
  excludedCounterpartyIds: string[];
  days: number;
  amountThreshold?: number;
}

export async function evaluateTransactionDirectionAndCounterpartyRule({
  direction,
  excludedCounterpartyIds,
  days,
  amountThreshold,
}: EvaluateTransactionDirectionAndCounterpartyRuleParams) {
  let conditions: Prisma.Sql[] = [];

  // Add condition for transaction direction
  conditions.push(Prisma.sql`"transactionDirection" = ${direction}`);

  // Exclude specific counterparty IDs
  if (excludedCounterpartyIds.length > 0) {
    conditions.push(
      Prisma.sql`AND "counterpartyId" NOT IN (${Prisma.join(excludedCounterpartyIds)})`,
    );
  }

  // Filter transactions from the last N days
  conditions.push(Prisma.sql`AND "transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'`);

  // Build the WHERE clause from conditions
  const whereClause = Prisma.join(conditions, ' ');

  // Construct the query with dynamic conditions
  let query = Prisma.sql`SELECT * FROM "TransactionRecord" WHERE ${whereClause}`;

  // Add a HAVING clause if an amount threshold is specified
  if (amountThreshold !== undefined) {
    query = Prisma.sql`${query} GROUP BY "TransactionRecord"."id" HAVING SUM("transactionAmount") > ${amountThreshold}`;
  }

  // Log the query for debugging
  console.log(Prisma.raw(query));

  // Execute the query
  const results = await prisma.$queryRawUnsafe(query); // Use $queryRawUnsafe for dynamic queries
  return results;
}
