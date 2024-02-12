// evaluate-chargeback-frequency.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EvaluateChargebackFrequencyParams {
  days: number;
  numberOfChargebacks: number;
}

export async function evaluateChargebackFrequency({
  days,
  numberOfChargebacks,
}: EvaluateChargebackFrequencyParams) {
  const query = Prisma.sql`
    SELECT "customerId", COUNT(*) AS chargeback_count
    FROM "TransactionRecord"
    WHERE "transactionType" = 'chargeback'
    AND "transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'
    GROUP BY "customerId"
    HAVING COUNT(*) > ${numberOfChargebacks}
  `;

  const results = await prisma.$queryRawUnsafe(query);
  return results;
}
