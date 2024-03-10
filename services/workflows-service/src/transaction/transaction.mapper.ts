import { Prisma } from '@prisma/client';
import { CounterpartyInfo, TransactionCreateDto } from './dtos/transaction-create.dto';
import { InputJsonValue, TProjectId } from '@/types';
import { HttpException } from '@nestjs/common';

export class TransactionEntityMapper {
  static toCreateData({ dto, projectId }: { dto: TransactionCreateDto; projectId: TProjectId }) {
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
      transactionDirection: dto.direction ?? null,
      transactionReference: dto.reference ?? null,

      paymentMethod: dto.payment?.method ?? null,
      paymentType: dto.payment?.type ?? null,
      paymentChannel: dto.payment?.channel ?? null,
      paymentIssuer: dto.payment?.issuer ?? null,
      paymentGateway: dto.payment?.gateway ?? null,
      paymentAcquirer: dto.payment?.acquirer ?? null,
      paymentProcessor: dto.payment?.processor ?? null,
      paymentBrandName: dto.payment?.brandName ?? null,

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
      additionalInfo: (dto.additionalInfo ?? null) as unknown as InputJsonValue,

      productName: dto.product?.name ?? null,
      productDescription: dto.product?.description ?? null,
      productPrice: dto.product?.price ?? null,
      productId: dto.product?.id ?? null,
      productSku: dto.product?.sku ?? null,

      counterpartyOriginator: this.getCounterpartyCreateInput({
        counterpartyInfo: dto.originator,
        projectId,
      }),

      counterpartyBeneficiary: this.getCounterpartyCreateInput({
        counterpartyInfo: dto.beneficiary,
        projectId,
      }),

      unusualActivityFlags: dto.unusualActivityFlags ?? {},

      originatorSortCode: dto.originator?.sortCode ?? null,
      originatorBankCountry: dto.originator?.bankCountry ?? null,

      cardBin: dto.cardDetails?.cardBin ?? null,
      productPriceCurrency: dto.product?.currency ?? null,

      project: { connect: { id: projectId } },
    } as const satisfies Omit<
      Prisma.TransactionRecordCreateArgs['data'],
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
    >;
  }

  private static getCounterpartyCreateInput({
    counterpartyInfo,
    projectId,
  }: {
    counterpartyInfo: CounterpartyInfo | undefined;
    projectId: string;
  }):
    | Prisma.TransactionRecordCreateInput['counterpartyOriginator']
    | Prisma.TransactionRecordCreateInput['counterpartyBeneficiary'] {
    if (counterpartyInfo?.businessData && counterpartyInfo?.endUserData) {
      throw new HttpException(
        'Counterparty must have either business or end user data, not both.',
        400,
      );
    }

    return counterpartyInfo
      ? {
          connectOrCreate: {
            where: {
              projectId_correlationId: {
                correlationId: counterpartyInfo.correlationId,
                projectId: projectId,
              },
            },
            create: {
              project: { connect: { id: projectId } },
              correlationId: counterpartyInfo.correlationId,
              business: counterpartyInfo.businessData
                ? {
                    connectOrCreate: {
                      where: {
                        projectId_correlationId: {
                          correlationId: counterpartyInfo.correlationId,
                          projectId: projectId,
                        },
                      },
                      create: {
                        project: { connect: { id: projectId } },
                        correlationId: counterpartyInfo.correlationId,
                        companyName: counterpartyInfo.businessData.companyName,
                        registrationNumber: counterpartyInfo.businessData.registrationNumber,
                        mccCode: counterpartyInfo.businessData.mccCode,
                        businessType: counterpartyInfo.businessData.businessType,
                      },
                    },
                  }
                : {},
              endUser: counterpartyInfo.endUserData
                ? {
                    connectOrCreate: {
                      where: {
                        projectId_correlationId: {
                          correlationId: counterpartyInfo.correlationId,
                          projectId: projectId,
                        },
                      },
                      create: {
                        project: { connect: { id: projectId } },
                        correlationId: counterpartyInfo.correlationId,
                        firstName: counterpartyInfo.endUserData.firstName,
                        lastName: counterpartyInfo.endUserData.lastName,
                        email: counterpartyInfo.endUserData.email,
                        isContactPerson: counterpartyInfo.endUserData.isContactPerson,
                        phone: counterpartyInfo.endUserData.phone,
                        dateOfBirth: counterpartyInfo.endUserData.dateOfBirth,
                        avatarUrl: counterpartyInfo.endUserData.avatarUrl,
                      },
                    },
                  }
                : {},
            },
          },
        }
      : undefined;
  }
}
