import { ApiProperty } from '@nestjs/swagger';
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
  CounterpartyType,
  TransactionDirection,
  PaymentMethod,
} from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JsonValue } from 'type-fest';
import { BusinessCreateDto } from '@/business/dtos/business-create';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';

export class CounterpartyInfo {
  @ApiProperty({ required: true }) @IsString() correlationId!: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() id?: string;
  @ApiProperty({ required: true }) @IsString() @IsOptional() type?: CounterpartyType;
  @ApiProperty({ required: false }) @IsString() @IsOptional() sortCode?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() bankCountry?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Type(() => EndUserCreateDto)
  @IsOptional()
  entityData?: (BusinessCreateDto | EndUserCreateDto) & { id: string };
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
  @ApiProperty({ required: false }) @IsString() @IsOptional() cardBIN?: number;
  // Add other card-related fields as necessary
}
export class TransactionCreateDto {
  @ApiProperty({ required: true }) @IsDate() @IsNotEmpty() date!: Date;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() currency!: string;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() baseAmount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() baseCurrency!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() projectId!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() correlationId!: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() category?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() direction?: TransactionDirection;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reference?: string;

  @ApiProperty({ required: false, type: 'object' }) @IsOptional() tags?: JsonValue | null;
  @ApiProperty({ required: false, type: 'object' }) @IsOptional() auditTrail?: JsonValue | null;
  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  unusualActivityFlags?: JsonValue | null;

  @ApiProperty({ required: false })
  @IsEnum(TransactionRecordType)
  @IsOptional()
  type?: TransactionRecordType;
  @ApiProperty({ required: false })
  @IsEnum(TransactionRecordStatus)
  @IsOptional()
  status?: TransactionRecordStatus;
  @ApiProperty({ required: false }) @IsString() @IsOptional() statusReason?: string;

  @ApiProperty({ type: CounterpartyInfo })
  @ValidateNested()
  @Type(() => CounterpartyInfo)
  @IsOptional()
  originator?: CounterpartyInfo;

  @ApiProperty({ type: CounterpartyInfo })
  @ValidateNested()
  @Type(() => CounterpartyInfo)
  @IsOptional()
  beneficiary?: CounterpartyInfo;

  @ApiProperty({ type: PaymentInfo })
  @ValidateNested()
  @Type(() => PaymentInfo)
  @IsOptional()
  payment?: PaymentInfo;

  @ApiProperty({ type: BusinessCreateDto })
  @ValidateNested()
  @Type(() => BusinessCreateDto)
  @IsOptional()
  business?: BusinessCreateDto;

  @ApiProperty({ type: EndUserCreateDto })
  @ValidateNested()
  @Type(() => EndUserCreateDto)
  @IsOptional()
  individual?: EndUserCreateDto;

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

  @ApiProperty({ required: false }) @IsEnum(ReviewStatus) @IsOptional() reviewStatus?: ReviewStatus;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reviewerComments?: string;

  @ApiProperty({ required: false }) @IsNumber() @IsOptional() riskScore?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() regulatoryAuthority?: string;
  @ApiProperty({ required: false, type: 'object' }) @IsOptional() additionalInfo?: JsonValue | null;
}
