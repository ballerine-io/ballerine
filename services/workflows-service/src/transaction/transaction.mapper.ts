import { TransactionRecord } from '@prisma/client';
import { CounterpartyInfo, TransactionCreateDto } from './dtos/transaction-create.dto';
import { cleanUndefinedValues } from '@/common/utils/clean-undefined-values';

export class TransactionEntityMapper {
  static toEntity(
    dto: TransactionCreateDto,
  ): Omit<
    TransactionRecord,
    | 'createdAt'
    | 'updatedAt'
    | 'id'
    | 'originatorIpAddress'
    | 'originatorGeoLocation'
    | 'originatorUserAgent'
    | 'auditTrail'
    | 'riskScore'
    | 'endUserId'
    | 'businessId'
    | 'transactionDirection'
  > {
    return {
      transactionCorrelationId: dto.correlationId,
      transactionDate: dto.date,
      transactionAmount: dto.amount,
      transactionCurrency: dto.currency,
      transactionDescription: dto.description ?? null,
      transactionCategory: dto.category ?? null,
      transactionType: dto.type ?? null,
      transactionStatus: dto.status ?? null,
      transactionStatusReason: dto.statusReason ?? null,
      transactionBaseAmount: dto.baseAmount,
      transactionBaseCurrency: dto.baseCurrency,

      paymentMethod: dto.payment?.method ?? null,
      paymentType: dto.payment?.type ?? null,
      paymentChannel: dto.payment?.channel ?? null,
      paymentIssuer: dto.payment?.issuer ?? null,
      paymentGateway: dto.payment?.gateway ?? null,
      paymentAcquirer: dto.payment?.acquirer ?? null,
      paymentProcessor: dto.payment?.processor ?? null,

      // Assuming card details and tags are part of the DTO
      cardFingerprint: dto.cardDetails?.fingerprint ?? null,
      cardIssuedCountry: dto.cardDetails?.issuedCountry ?? null,
      completed3ds: dto.cardDetails?.completed3ds ?? null,
      cardType: dto.cardDetails?.type ?? null,
      cardIssuer: dto.cardDetails?.issuer ?? null,
      cardBrand: dto.cardDetails?.brand ?? null,
      cardExpiryMonth: dto.cardDetails?.expiryMonth ?? null,
      cardExpiryYear: dto.cardDetails?.expiryYear ?? null,
      cardHolderName: dto.cardDetails?.holderName ?? null,
      cardTokenized: dto.cardDetails?.tokenized ?? null,

      tags: dto.tags ?? {},
      reviewStatus: dto.reviewStatus ?? null,
      reviewerComments: dto.reviewerComments ?? null,

      regulatoryAuthority: dto.regulatoryAuthority ?? null,
      additionalInfo: dto.additionalInfo ?? null,

      productName: dto.product?.name ?? null,
      productDescription: dto.product?.description ?? null,
      productPrice: dto.product?.price ?? null,
      productId: dto.product?.id ?? null,
      productSku: dto.product?.sku ?? null,

      projectId: dto.projectId,
      counterpartyOriginatorId: dto.originator?.id ?? null,
      counterpartyBeneficiaryId: dto.beneficiary?.id ?? null,
      unusualActivityFlags: dto.unusualActivityFlags ?? {},
    };
  }

  static toDto(record: TransactionRecord): TransactionCreateDto & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    originator: Partial<CounterpartyInfo | undefined>;
    beneficiary: Partial<CounterpartyInfo | undefined>;
  } {
    const dto: TransactionCreateDto & {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      originator: Partial<CounterpartyInfo> | undefined;
      beneficiary: Partial<CounterpartyInfo> | undefined;
    } = {
      id: record.id,
      correlationId: record.transactionCorrelationId,
      date: record.transactionDate,
      amount: record.transactionAmount,
      currency: record.transactionCurrency,
      description: record.transactionDescription || undefined,
      category: record.transactionCategory || undefined,
      type: record.transactionType || undefined,
      status: record.transactionStatus || undefined,
      statusReason: record.transactionStatusReason || undefined,
      baseAmount: record.transactionBaseAmount,
      baseCurrency: record.transactionBaseCurrency,
      projectId: record.projectId,
      originator: record.counterpartyOriginatorId
        ? {
            id: record.counterpartyOriginatorId,
            correlationId: '', // TODO: Add the required correlationId property here (should come from the countryparty table)
          }
        : undefined,

      beneficiary: record.counterpartyBeneficiaryId
        ? {
            id: record.counterpartyBeneficiaryId,
            correlationId: '', // TODO: Add the required correlationId property here
          }
        : undefined,

      payment: {
        method: record.paymentMethod || undefined,
        type: record.paymentType || undefined,
        channel: record.paymentChannel || undefined,
        issuer: record.paymentIssuer || undefined,
        gateway: record.paymentGateway || undefined,
        acquirer: record.paymentAcquirer || undefined,
        processor: record.paymentProcessor || undefined,
      },
      product: {
        name: record.productName || undefined,
        description: record.productDescription || undefined,
        price: record.productPrice || undefined,
        sku: record.productSku || undefined,
        id: record.productId || undefined,
      },

      tags: record.tags,
      reviewStatus: record.reviewStatus || undefined,
      reviewerComments: record.reviewerComments || undefined,
      riskScore: record.riskScore || undefined,
      regulatoryAuthority: record.regulatoryAuthority || undefined,
      additionalInfo: record.additionalInfo,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      auditTrail: record.auditTrail,
      unusualActivityFlags: record.unusualActivityFlags,
    };

    return cleanUndefinedValues<
      TransactionCreateDto & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originator: Partial<CounterpartyInfo | undefined>;
        beneficiary: Partial<CounterpartyInfo | undefined>;
      }
    >(dto);
  }
}
