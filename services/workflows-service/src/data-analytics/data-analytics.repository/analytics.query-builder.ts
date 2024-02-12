import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export class AnalyticsQueryBuilder {
  private conditions: Prisma.Sql[] = [];
  private havingConditions: string[] = [];
  private parameters: any[] = [];

  constructor(private transactionDirection: 'Inbound' | 'Outbound') {}

  excludeCounterpartyIds(ids: string[]) {
    if (ids.length) {
      const idValues = ids.map(id => Prisma.sql`${id}`).map(sqlFragment => sqlFragment.sql); 
      this.conditions.push(
        Prisma.sql`counterpartyOriginatorId NOT IN (${idValues.join(',')})`, 
      );
    }
    return this;
  }

  addDateRange(timeUnit: 'minutes' | 'hours' | 'days' | 'months', amount: number) {
    this.conditions.push(
      Prisma.sql`transactionDate >= CURRENT_DATE - INTERVAL '${amount} ${timeUnit}'`,
    );
    return this;
  }

  includeExcludePaymentMethods(include: string[] = [], exclude: string[] = []) {
    if (include.length) {
      this.conditions.push(
        Prisma.sql`payment_method IN (${Prisma.join(
          include.map(method => Prisma.sql`${method}`),
        )})`,
      );
    }
    if (exclude.length) {
      this.conditions.push(
        Prisma.sql`payment_method NOT IN (${Prisma.join(
          exclude.map(method => Prisma.sql`${method}`),
        )})`,
      );
    }
    return this;
  }

  setAmountThreshold(operation: 'sum' | 'count', amount: number, column: string) {
    const op = operation === 'sum' ? `SUM(${column})` : `COUNT(${column})`;
    this.havingConditions.push(`${op} > ${amount}`);
    return this;
  }

async execute() {
    let query = Prisma.sql`SELECT * FROM ${'sdds'} WHERE "transactionDirection" = 'Incoming'`;

    if (this.conditions.length) {
        query = Prisma.sql`${query} AND ${Prisma.join(this.conditions, ' AND ')}`;
    }

    if (this.havingConditions.length) {
        query = Prisma.sql`${query} GROUP BY counterpartyOriginatorId HAVING ${Prisma.join(this.havingConditions, ' AND ')}`;
    }

    console.log(query);
    return await prisma.$queryRaw(query);
}
}
// invokination example
// const queryBuilder = new AnalyticsQueryBuilder('Inbound');
// queryBuilder
//   .excludeCounterpartyIds(['9999999999999999', '999999******9999'])
//   .addDateRange('days', 7)
//   .includeExcludePaymentMethods(['credit_card'], ['debit_card'])
//   .setAmountThreshold('sum', 1000, 'transactionAmount');

// const results = await queryBuilder.execute();
// runQuery().catch(console.error).finally(async () => await prisma.$disconnect());
