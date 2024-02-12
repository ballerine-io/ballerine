// evaluate-refund-amount.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EvaluateRefundAmountParams {
  days: number;
  totalRefundAmountThreshold: number;
}

export async function evaluateRefundAmount({
  days,
  totalRefundAmountThreshold,
}: EvaluateRefundAmountParams) {
  const query = Prisma.sql`
    SELECT "customerId", SUM("transactionAmount") AS total_refund_amount
    FROM "TransactionRecord"
    WHERE "transactionType" = 'refund'
    AND "transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'
    GROUP BY "customerId"
    HAVING SUM("transactionAmount") > ${totalRefundAmountThreshold}
  `;

  const results = await prisma.$queryRawUnsafe(query);
  return results;
}
