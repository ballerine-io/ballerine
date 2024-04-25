import { PaymentBrandName, Prisma } from '@prisma/client';
import {
  CounterpartyInfo,
  TransactionCreateAltDto,
  TransactionCreateDto,
} from './dtos/transaction-create.dto';
import { InputJsonValue, TProjectId } from '@/types';
import { HttpException } from '@nestjs/common';

export class TransactionEntityMapper {
  static toCreateData({ dto, projectId }: { dto: TransactionCreateDto; projectId: TProjectId }) {
    if (!dto.originator || !dto.beneficiary) {
      throw new HttpException('Originator and beneficiary are required.', 400);
    }

    return {
      transactionCorrelationId: dto.correlationId,
      transactionDate: dto.date,
      transactionAmount: dto.amount,
      transactionCurrency: dto.currency,
      transactionDescription: dto.description ?? null,
      transactionCategory: dto.category ?? null,
      transactionType: dto.type ?? null,
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
      paymentMccCode: dto.payment?.mccCode ?? null,

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
    counterpartyInfo: CounterpartyInfo;
    projectId: string;
  }):
    | Prisma.TransactionRecordCreateInput['counterpartyOriginator']
    | Prisma.TransactionRecordCreateInput['counterpartyBeneficiary'] {
    if (!counterpartyInfo?.businessData && !counterpartyInfo?.endUserData) {
      throw new HttpException('Counterparty must have either business or end user data.', 400);
    }

    if (counterpartyInfo?.businessData && counterpartyInfo?.endUserData) {
      throw new HttpException('Counterparty must have either business or end user data.', 400);
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

  static altDtoToOriginalDto(aclDto: TransactionCreateAltDto): TransactionCreateDto {
    let originator: CounterpartyInfo = {} as CounterpartyInfo;
    let beneficiary: CounterpartyInfo = {} as CounterpartyInfo;

    if (aclDto.tx_direction === 'outbound') {
      originator = {
        correlationId: aclDto.customer_id,
        businessData: aclDtoToBusinessData(aclDto),
      };
      beneficiary = {
        correlationId: aclDto.counterparty_id,
        endUserData: aclDtoToEndUserData(aclDto),
      };
    } else {
      originator = {
        correlationId: aclDto.counterparty_id,
        endUserData: aclDtoToEndUserData(aclDto),
      };
      beneficiary = {
        correlationId: aclDto.customer_id,
        businessData: aclDtoToBusinessData(aclDto),
      };
    }

    const oldDto: TransactionCreateDto = {
      date: new Date(aclDto.tx_date_time),
      amount: aclDto.tx_amount,
      currency: aclDto.tx_currency,
      baseAmount: aclDto.tx_base_amount,
      baseCurrency: aclDto.tx_base_currency,
      correlationId: aclDto.tx_id,
      description: aclDto.tx_reference_text,
      direction: aclDto.tx_direction,
      reference: aclDto.tx_reference_text,
      // type: aclDto.tx_type,
      originator,
      beneficiary,
      payment: {
        channel: aclDto.tx_payment_channel,
        mccCode: parseInt(aclDto.tx_mcc_code || '0'),
        brandName: (
          aclDto.counterparty_institution_name ||
          aclDto.tx_product ||
          aclDto.counterparty_type
        ).toLowerCase() as PaymentBrandName,
      },
      cardDetails: {
        cardBin: parseInt(aclDto.counterparty_institution_id) || undefined,
      },
      additionalInfo: {},
    };

    return oldDto;
  }
}

const aclDtoToBusinessData: (aclDto: TransactionCreateAltDto) => {
  address: {
    street: string;
    postcode: string;
    state: string;
    country: string;
  };
  companyName: string;
  businessType: string;
} = aclDto => {
  return {
    address: {
      street: aclDto.customer_address,
      postcode: aclDto.customer_postcode,
      state: aclDto.customer_state,
      country: aclDto.customer_country,
    },
    companyName: aclDto.customer_name,
    businessType: aclDto.customer_type,
  };
};

const aclDtoToEndUserData: (aclDto: TransactionCreateAltDto) => {
  firstName: string;
  lastName: string;
} = aclDto => {
  const firstName = aclDto.counterparty_name.split(' ').slice(0, -1).join(' ');
  const lastName = aclDto.counterparty_name.split(' ').slice(-1).join(' ');

  return {
    firstName,
    lastName,
  };
};
