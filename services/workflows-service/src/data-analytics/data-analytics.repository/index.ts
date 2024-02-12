import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataAnalyticsRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async getSumOfInboundTransactions(
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
  ): Promise<number> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // Assuming 'CREDIT_CARD' and 'NON_CREDIT_CARD' can be distinguished by a field in your schema
    const whereCondition: any = {
      counterpartyId,
      transactionDate: {
        gte: sinceDate,
      },
      // Add conditions based on transactionType and inbound identification as needed
    };

    // Adjust the condition based on how you identify credit card transactions
    if (transactionType === 'CREDIT_CARD') {
      whereCondition.paymentMethod = 'CreditCard'; // Example, adjust as needed
    } else {
      whereCondition.paymentMethod = { not: 'CreditCard' }; // Example, adjust as needed
    }

    const result = await this.prisma.transactionRecord.aggregate({
      _sum: {
        transactionAmount: true,
      },
      where: whereCondition,
    });

    return result._sum.transactionAmount || 0;
  }

  async getSumOfTransactionsFromCounterpartyWithinDays(
    customerId: string,
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
  ): Promise<number> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const whereCondition: any = {
      customerId,
      counterpartyId: { notIn: ['9999999999999999', '999999******9999'] },
      transactionDate: { gte: sinceDate },
    };

    if (transactionType === 'CREDIT_CARD') {
      whereCondition.paymentMethod = 'CreditCard'; // Adjust based on your schema
    } else {
      whereCondition.paymentMethod = { not: 'CreditCard' }; // Adjust based on your schema
    }

    const result = await this.prisma.transactionRecord.aggregate({
      _sum: { transactionAmount: true },
      where: whereCondition,
    });

    return result._sum.transactionAmount || 0;
  }

  async getCountOfTransactionsFromCounterpartyWithinDays(
    customerId: string,
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
  ): Promise<number> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const whereCondition: any = {
      customerId,
      counterpartyId: { notIn: ['9999999999999999', '999999******9999'] },
      transactionDate: { gte: sinceDate },
    };

    if (transactionType === 'CREDIT_CARD') {
      whereCondition.paymentMethod = 'CreditCard'; // Adjust based on your schema
    } else {
      whereCondition.paymentMethod = { not: 'CreditCard' }; // Adjust based on your schema
    }

    const result = await this.prisma.transactionRecord.count({
      where: whereCondition,
    });

    return result;
  }
}
