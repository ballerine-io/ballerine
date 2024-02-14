import { PrismaClient, Prisma, TransactionDirection, PaymentMethod, TransactionRecordType } from '@prisma/client';
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

  console.log('Executing query...', query.sql);
  const results = await prisma.$queryRaw(query);

  console.debug(results);
  return results;
}

// P-LVAL
export async function evaluatePaymentUnexpected({
  projectId,
  factor = 2,
  customerExpectedAmount = 0,
}: {
  projectId: string;
  factor?: number;
  customerExpectedAmount?: number;
}) {
  // TODO: get the customer expected amount from the customer's config
  let conditions: Prisma.Sql[] = [
    Prisma.sql`tr."projectId" = ${projectId}`,
    Prisma.sql`jsonb_exists(config, 'customer_expected_amount') AND ((config ->> 'customer_expected_amount')::numeric * ${factor}) != ${customerExpectedAmount}`,
    Prisma.sql`tr."transactionAmount" > (config ->> 'customer_expected_amount')::numeric`,
  ];

  let query: Sql = Prisma.sql`SELECT tr."businessId" , tr."transactionAmount" FROM "TransactionRecord" as tr
  WHERE ${Prisma.join(conditions, ' AND ')} `;

  const results = await prisma.$queryRaw(query);

  return results;
}

// DORMANT
export async function evaluateDormantAccount({ projectId }: { projectId: string }) {
  const queryV1: Sql = Prisma.sql`SELECT 
  "totalTrunsactionAllTime"."businessId",
  "totalTrunsactionAllTime"."totalTrunsactionAllTime",
  "totalTransactionWithinSixMonths"."totalTransactionWithinSixMonths"
FROM
  (
      SELECT
          "tr"."businessId",
          COUNT(tr."id") AS "totalTrunsactionAllTime"
      FROM
          "TransactionRecord" AS "tr"
      WHERE 
        tr."projectId" = '${projectId}'
        AND tr."businessId" IS NOT NULL
      GROUP BY
          tr."businessId"
      HAVING COUNT(tr."id") > 1
  ) AS "totalTrunsactionAllTime"
JOIN
  (
      SELECT
          "tr"."businessId",
          COUNT("tr"."id") AS "totalTransactionWithinSixMonths"
      FROM
          "TransactionRecord" AS "tr"
      WHERE
          tr."projectId" = '${projectId}'
          AND tr."businessId" IS NOT NULL
          AND "transactionDate" >= CURRENT_DATE - INTERVAL '180 days'
      GROUP BY
          tr."businessId"
      HAVING COUNT(tr."id") = 1
  ) AS "totalTransactionWithinSixMonths"
ON "totalTrunsactionAllTime"."businessId" = "totalTransactionWithinSixMonths"."businessId";`;

  const queryV2: Sql = Prisma.sql`
  SELECT
	tr."businessId",
	COUNT(
		CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '1 days' THEN
			tr."id"
		END) AS "totalTransactionWithinSixMonths",
	COUNT(tr."id") AS "totalTrunsactionAllTime"
FROM
	"TransactionRecord" AS tr
WHERE
	tr."projectId" = '${projectId}'
	AND tr."businessId" IS NOT NULL
GROUP BY
	tr."businessId"
HAVING
	COUNT(
		CASE WHEN tr."transactionDate" >= CURRENT_DATE - INTERVAL '1 days' THEN
			tr."id"
		END) = 1
	AND COUNT(tr."id") > 1;  
`;

  const results = await prisma.$queryRaw(queryV2);

  return results;
}

// NUMCHRG	High Velocity - Chargeback 	Customer	Grouped: Customer	Significant number of chargebacks over a set period of time
// SUMCHRG	High Cumulative Amount - Chargeback 	Customer	Grouped: Customer	High sum of chargebacks over a set period of time
// NUMREFCC	High Velocity - Refund	Customer	Grouped: Customer	Significant number of refunds over a set period of time 
// SUMREFCC	High Cumulative Amount - Refund	Customer	Grouped: Customer	High sum of refunds over a set period of time 
export async function evaluateCustomersTransactionType({
  projectId,
  transactionType,
  amountThreshold = 5_000,
  paymentMethods = [],
  days = 7,
  isCumulative = false,
  isPerBrand = false,
}: {
  projectId: string;
  transactionType: TransactionRecordType[];
  isCumulative: boolean;
  amountThreshold?: number;
  paymentMethods?: string[];
  days?: number;
  isPerBrand?: boolean;
}) {
  if (!projectId) {
    throw new Error('projectId is required');
  }

  if (!Array.isArray(transactionType) || !transactionType.length) {
    throw new Error('transactionType is required');
  }

  
  let conditions: Prisma.Sql[] = [
    Prisma.sql`tr."projectId" = '${projectId}'`,
    Prisma.sql`tr."businessId" IS NOT NULL`,
    // TODO: should we use equation instead of IN clause?
    Prisma.sql`tr."transactionType" IN (${Prisma.join(transactionType.map((type) => `'${type}'::"TransactionRecordType"`), ',')})`,
    Prisma.sql`SUM(tr."transactionAmount") > ${amountThreshold}`,
    Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'`,
  ];

  if (Array.isArray(paymentMethods.length)) {
    conditions.push(Prisma.sql`"paymentMethod" IN (${Prisma.join(paymentMethods)})`);
  }

  const select: Prisma.Sql = isCumulative ? Prisma.sql`SUM("transactionAmount") AS "totalAmount"`: Prisma.sql`COUNT(tr."id") as totalTransactions`

  // High Velocity - Refund
  const groupBy: Prisma.Sql = isPerBrand ? Prisma.sql`productId` : Prisma.empty;

  const query: Sql = Prisma.sql`SELECT tr."businessId", ${select},
  FROM "TransactionRecord" as tr
  GROUP BY ${Prisma.join(['tr."businessId"', groupBy], ',')}
  `;

  console.log('Executing query...', query.sql);
  const results = await prisma.$queryRaw`${query}`;

  console.debug(results);
  return results;
}

// HANUMICC	High Velocity - Historic Average - Inbound	Customer	Grouped: Customer	Total number of incoming transactions exceeds client’s historical average
export async function evalHistoricAvgOfIncomingTransaction({
  brandName,
  transactionType,
  direction = TransactionDirection.Inbound,
  paymentMethods = [],
  days = 7,
}: {
  brandName: string;
  transactionType: TransactionRecordType[];
  direction: TransactionDirection,
  amountThreshold?: number;
  paymentMethods?: string[];
  days?: number;
}) {
  if (!brandName) {
    throw new Error('brandName is required');
  }

  if (!Array.isArray(transactionType) || !transactionType.length) {
    throw new Error('transactionType is required');
  }

  let conditions: Prisma.Sql[] = [
    Prisma.sql`tr."businessId" IS NOT NULL`,
    Prisma.sql`tr."paymentBrandName" = '${brandName}'`,
    Prisma.sql`"transactionDirection" = '${direction}'::"TransactionDirection"`,
    Prisma.sql`COUNT()`,
    Prisma.sql`COUNT()`,
    Prisma.sql`"transactionDate" >= CURRENT_DATE - INTERVAL '${days} days'`,
  ];

  if (Array.isArray(paymentMethods.length)) {
    conditions.push(Prisma.sql`"paymentMethod" IN (${Prisma.join(paymentMethods)})`);
  }

  const select: Prisma.Sql = ;

  // High Velocity - Refund
  const groupBy: Prisma.Sql = ;

  const query: Sql = Prisma.sql`SELECT tr."businessId", ${select},
  FROM "TransactionRecord" as tr
  GROUP BY ${Prisma.join(['tr."paymentBrandName"', groupBy], ',')}
  `;

  console.log('Executing query...', query.sql);
  const results = await prisma.$queryRaw`${query}`;

  console.debug(results);
  return results;
}
