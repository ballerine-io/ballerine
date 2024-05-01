import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  TransactionRecordType,
  PaymentType,
  PaymentIssuer,
  PaymentGateway,
  PaymentAcquirer,
  PaymentProcessor,
  PaymentBrandName,
  TransactionDirection,
  PaymentMethod,
} from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { JsonValue } from 'type-fest';
import { BusinessCreateDto } from '@/business/dtos/business-create';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';

class CounterpartyBusinessCreateDto extends OmitType(BusinessCreateDto, ['correlationId']) {}
class CounterpartyEndUserCreateDto extends OmitType(EndUserCreateDto, ['correlationId']) {}

export const AltPaymentBrandNames = {
  SCB_PAYNOW: 'scb_paynow',
  ['China UnionPay']: 'china unionpay',
  ['American Express']: 'american express',

  ...PaymentBrandName,
} as const;

export type AltPaymentBrandNames = (typeof AltPaymentBrandNames)[keyof typeof AltPaymentBrandNames];
export class CounterpartyInfo {
  @ApiProperty({ required: true }) @IsString() correlationId!: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() sortCode?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() bankCountry?: string;

  @ApiProperty({ type: CounterpartyBusinessCreateDto })
  @ValidateIf(obj => !obj.endUserData)
  @ValidateNested()
  businessData?: CounterpartyBusinessCreateDto;

  @ApiProperty({ type: CounterpartyEndUserCreateDto })
  @ValidateIf(obj => !obj.businessData)
  @ValidateNested()
  endUserData?: CounterpartyEndUserCreateDto;
}

class PaymentInfo {
  @ApiProperty({ required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;
  @ApiProperty({ required: false }) @IsEnum(PaymentType) @IsOptional() type?: PaymentType;
  @ApiProperty({ required: false }) @IsString() @IsOptional() channel?: string;
  @ApiProperty({ required: false }) @IsEnum(PaymentIssuer) @IsOptional() issuer?: PaymentIssuer;
  @ApiProperty({ required: false }) @IsEnum(PaymentGateway) @IsOptional() gateway?: PaymentGateway;
  @ApiProperty({ required: false })
  @IsEnum(PaymentAcquirer)
  @IsOptional()
  acquirer?: PaymentAcquirer;
  @ApiProperty({ required: false })
  @IsEnum(PaymentProcessor)
  @IsOptional()
  processor?: PaymentProcessor;
  @ApiProperty({ required: false })
  @IsEnum(PaymentBrandName)
  @IsOptional()
  brandName?: PaymentBrandName;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() mccCode?: number;
}
class ProductInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() price?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() id?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() sku?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() currency?: string;
}

class CardInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() fingerprint?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() issuedCountry?: string;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() completed3ds?: boolean;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() issuer?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() brand?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() expiryMonth?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() expiryYear?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() holderName?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() tokenized?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() cardBin?: number;
}
export class TransactionCreateDto {
  @ApiProperty({ required: true }) @IsDateString() @IsNotEmpty() date!: Date;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() currency!: string;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() baseAmount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() baseCurrency!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() correlationId!: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() category?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() direction?: TransactionDirection;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reference?: string;

  @ApiProperty({ required: false, type: 'object' }) @IsOptional() tags?: JsonValue | null;

  @ApiProperty({ required: false })
  @IsEnum(TransactionRecordType)
  @IsOptional()
  type?: TransactionRecordType;

  @ApiProperty({ type: CounterpartyInfo })
  @ValidateNested()
  @Type(() => CounterpartyInfo)
  originator!: CounterpartyInfo;

  @ApiProperty({ type: CounterpartyInfo })
  @ValidateNested()
  @Type(() => CounterpartyInfo)
  beneficiary!: CounterpartyInfo;

  @ApiProperty({ type: PaymentInfo })
  @ValidateNested()
  @Type(() => PaymentInfo)
  @IsOptional()
  payment?: PaymentInfo;

  @ApiProperty({ type: ProductInfo })
  @ValidateNested()
  @Type(() => ProductInfo)
  @IsOptional()
  product?: ProductInfo;

  @ApiProperty({ type: CardInfo })
  @ValidateNested()
  @Type(() => CardInfo)
  @IsOptional()
  cardDetails?: CardInfo;

  @ApiProperty({ required: false }) @IsString() @IsOptional() regulatoryAuthority?: string;
  @ApiProperty({ required: false, type: 'object' }) @IsOptional() additionalInfo?: JsonValue | null;
}

export class TransactionCreateAltDto {
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() tx_date_time!: Date;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() tx_amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() tx_currency!: string;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() tx_base_amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() tx_base_currency!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() tx_id!: string;

  @ApiProperty({ required: false }) @IsString() @IsOptional() tx_reference_text?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() tx_direction?: TransactionDirection;
  @ApiProperty({ required: false }) @IsString() @IsOptional() tx_mcc_code?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() tx_payment_channel?: string;

  @ApiProperty({ required: true })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(AltPaymentBrandNames)
  @IsNotEmpty()
  tx_product!: AltPaymentBrandNames;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tx_type?: string;

  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() counterparty_id!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() counterparty_institution_id!: string;
  @ApiProperty({ required: false })
  @IsString()
  counterparty_institution_name?: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() counterparty_name!: string;
  @ApiProperty({ required: false })
  @IsString()
  counterparty_type?: string;

  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() customer_id!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() customer_name!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() customer_address!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() customer_country!: string;
  @ApiProperty({ required: true }) @IsString() @IsOptional() customer_postcode?: string;
  @ApiProperty({ required: true }) @IsString() @IsOptional() customer_state?: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() customer_type!: string;
}

export class TransactionCreateAltDtoWrapper {
  @ApiProperty({ type: TransactionCreateAltDto })
  @ValidateNested()
  @Type(() => TransactionCreateAltDto)
  data!: TransactionCreateAltDto;
}
