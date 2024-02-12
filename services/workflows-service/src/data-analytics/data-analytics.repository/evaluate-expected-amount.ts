// evaluate-expected-amount-rule.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EvaluateExpectedAmountRuleParams {
  expectedAmount: number;
  factor: number;
}

export async function evaluateExpectedAmountRule({
  expectedAmount,
  factor,
}: EvaluateExpectedAmountRuleParams) {
  const query = Prisma.sql`
    SELECT * FROM "TransactionRecord"
    WHERE "expectedTransactionAmount" IS NOT NULL
    AND "transactionAmount" > (${expectedAmount} * ${factor})
  `;

  const results = await prisma.$queryRawUnsafe(query);
  return results;
}
