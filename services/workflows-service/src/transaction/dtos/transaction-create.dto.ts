import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  TransactionRecordType,
  TransactionRecordStatus,
  PaymentType,
  PaymentChannel,
  PaymentIssuer,
  PaymentGateway,
  PaymentAcquirer,
  PaymentProcessor,
  PaymentBrandName,
  ReviewStatus,
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
import { Type } from 'class-transformer';
import { JsonValue } from 'type-fest';
import { BusinessCreateDto } from '@/business/dtos/business-create';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';

class CounterpartyBusinessCreateDto extends OmitType(BusinessCreateDto, ['correlationId']) {}
class CounterpartyEndUserCreateDto extends OmitType(EndUserCreateDto, ['correlationId']) {}

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
  @ApiProperty({ required: false }) @IsEnum(PaymentChannel) @IsOptional() channel?: PaymentChannel;
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
