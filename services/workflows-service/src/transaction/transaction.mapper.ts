import { PaymentBrandName, Prisma } from '@prisma/client';
import {
  CounterpartyInfo,
  TransactionCreateAltDto,
  TransactionCreateDto,
  AltPaymentBrandNames,
} from './dtos/transaction-create.dto';
import { InputJsonValue, TProjectId } from '@/types';
import { HttpException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { ValidationError } from '@/errors';

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

  static altDtoToOriginalDto(altDto: TransactionCreateAltDto): TransactionCreateDto {
    let originator: CounterpartyInfo = {} as CounterpartyInfo;
    let beneficiary: CounterpartyInfo = {} as CounterpartyInfo;

    if (altDto.tx_direction === 'outbound') {
      originator = {
        correlationId: altDto.customer_id,
        businessData: altDtoToBusinessData(altDto),
      };
      beneficiary = {
        correlationId: altDto.counterparty_id,
        endUserData: altDtoToEndUserData(altDto),
      };
    } else {
      originator = {
        correlationId: altDto.counterparty_id,
        endUserData: altDtoToEndUserData(altDto),
      };
      beneficiary = {
        correlationId: altDto.customer_id,
        businessData: altDtoToBusinessData(altDto),
      };
    }

    const tranformProductName = (brand: AltPaymentBrandNames): PaymentBrandName | undefined => {
      switch (brand) {
        case 'scb_paynow':
          return 'scb_pay_now';
        case 'china unionpay':
          return 'china_union_pay';
        case 'american express':
          return 'american_express';
        default:
          return undefined;
      }
    };

    let brandName;

    if (altDto.tx_product.toLowerCase() in PaymentBrandName) {
      brandName = altDto.tx_product.toLowerCase() as PaymentBrandName;
    } else {
      brandName = tranformProductName(altDto.tx_product.toLowerCase() as AltPaymentBrandNames);
    }

    const date = new Date(altDto.tx_date_time);
    const originalDto: TransactionCreateDto = {
      date: date.toISOString() as any,
      amount: altDto.tx_amount,
      currency: altDto.tx_currency,
      baseAmount: altDto.tx_base_amount,
      baseCurrency: altDto.tx_base_currency,
      correlationId: altDto.tx_id,
      description: altDto.tx_reference_text,
      direction: altDto.tx_direction,
      reference: altDto.tx_reference_text,
      originator,
      beneficiary,
      payment: {
        channel: altDto.tx_payment_channel,
        mccCode: parseInt(altDto.tx_mcc_code || '0'),
        brandName: brandName,
      },
      cardDetails: {
        cardBin: parseInt(altDto.counterparty_institution_id) || undefined,
      },
      additionalInfo: {
        type: altDto.tx_type,
      },
    };

    const creditCardBrands: PaymentBrandName[] = [
      'visa',
      'mastercard',
      'american_express',
      'discover',
      'jcb',
      'diners',
      'discover',
      'china_union_pay',
    ];
    const isCreditCard = creditCardBrands.includes(brandName || '');

    if (isCreditCard) {
      originalDto.payment!.method = 'credit_card';
    } else {
      originalDto.payment!.method = 'apm';
    }

    const errors = validateSync(Object.assign(new TransactionCreateDto(), originalDto));

    if (errors.length > 0) {
      throw new ValidationError(errors as any);
    } else {
      console.log('validation succeed');
    }

    return originalDto;
  }
}

const altDtoToBusinessData: (altDto: TransactionCreateAltDto) => {
  address: {
    street: string;
    postcode?: string;
    state?: string;
    country: string;
  };
  companyName: string;
  businessType: string;
} = altDto => {
  return {
    address: {
      street: altDto.customer_address,
      postcode: altDto.customer_postcode,
      state: altDto.customer_state,
      country: altDto.customer_country,
    },
    companyName: altDto.customer_name,
    businessType: altDto.customer_type,
  };
};

const altDtoToEndUserData: (altDto: TransactionCreateAltDto) => {
  firstName: string;
  lastName: string;
} = altDto => {
  const firstName = altDto.counterparty_name.split(' ').slice(0, -1).join(' ');
  const lastName = altDto.counterparty_name.split(' ').slice(-1).join(' ');

  return {
    firstName,
    lastName,
  };
};
