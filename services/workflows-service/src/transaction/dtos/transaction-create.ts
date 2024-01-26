import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, VerificationStatus, TransactionStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { type InputJsonValue } from '@/types';

class SenderInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() accountId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() correlationId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() country?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() ipAddress?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() geoLocation?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() userAgent?: string;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() PEPStatus?: boolean;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() sanctionListMatchStatus?: boolean;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  verificationStatus?: VerificationStatus;
}

class RecipientInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() accountId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() correlationId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() enduserId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() country?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  verificationStatus?: VerificationStatus;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() sanctionListMatchStatus?: boolean;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() PEPStatus?: boolean;
}

class PaymentInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() method?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() channel?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() issuer?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() gateway?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() acquirer?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() processor?: string;
}

class ProductInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() price?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() id?: string;
}

export class TransactionCreateDto {
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() correlationId!: string;
  @ApiProperty({ required: true }) @IsDate() @IsNotEmpty() date!: Date;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() currency!: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() category?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type?: TransactionType;
  @ApiProperty({ required: false }) @IsString() @IsOptional() status?: TransactionStatus;
  @ApiProperty({ required: false }) @IsString() @IsOptional() statusReason?: string;

  @ApiProperty({ type: SenderInfo }) @IsOptional() sender?: SenderInfo;
  @ApiProperty({ type: RecipientInfo }) @IsOptional() recipient?: RecipientInfo;
  @ApiProperty({ type: PaymentInfo }) @IsOptional() payment?: PaymentInfo;
  @ApiProperty({ type: ProductInfo }) @IsOptional() product?: ProductInfo;

  @ApiProperty({ required: false }) @IsString() @IsOptional() tags?: InputJsonValue;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reviewStatus?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reviewerComments?: string;
  @ApiProperty({ required: false }) @IsJSON() @IsOptional() auditTrail?: InputJsonValue;

  @ApiProperty({ required: false }) @IsJSON() @IsOptional() unusualActivityFlags?: InputJsonValue;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() riskScore?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() regulatoryAuthority?: string;
  @ApiProperty({ required: false }) @IsJSON() @IsOptional() additionalInfo?: InputJsonValue;

  @ApiProperty({ required: false }) @IsDate() @IsOptional() createdAt?: Date;
  @ApiProperty({ required: false }) @IsDate() @IsOptional() updatedAt?: Date;

  // Nullable relations
  @ApiProperty({ required: false }) @IsString() @IsOptional() businessId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() endUserId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() projectId?: string;
}
