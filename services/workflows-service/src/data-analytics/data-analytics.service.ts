import { Injectable } from '@nestjs/common';
import { DataAnalyticsRepository } from './data-analytics.repository';

@Injectable()
export class DataAnalyticsService {
  constructor(private dataAnalyticsRepository: DataAnalyticsRepository) {}

  async getSumOfInboundTransactionsForCounterparty(
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
  ): Promise<number> {
    return this.dataAnalyticsRepository.getSumOfInboundTransactions(
      counterpartyId,
      transactionType,
      days,
    );
  }

  async getSumOfTransactionsFromCounterparty(
    customerId: string,
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
    amountThreshold: number,
  ): Promise<boolean> {
    const sum = await this.dataAnalyticsRepository.getSumOfTransactionsFromCounterpartyWithinDays(
      customerId,
      counterpartyId,
      transactionType,
      days,
    );
    return sum > amountThreshold;
  }

  async getCountOfTransactionsFromCounterparty(
    customerId: string,
    counterpartyId: string,
    transactionType: 'CREDIT_CARD' | 'NON_CREDIT_CARD',
    days: number,
    countThreshold: number,
  ): Promise<boolean> {
    const count =
      await this.dataAnalyticsRepository.getCountOfTransactionsFromCounterpartyWithinDays(
        customerId,
        counterpartyId,
        transactionType,
        days,
      );
    return count > countThreshold;
  }
}
