import { ApiProperty } from '@nestjs/swagger';
import { AlertStatus, AlertType, VerificationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { JsonValue } from 'type-fest';

class SenderInfo {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accountId?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  correlationId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() country?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  geoLocation?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  PEPStatus?: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  sanctionListMatchStatus?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  verificationStatus?: VerificationStatus;
}

class RecipientInfo {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accountId?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  correlationId?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  enduserId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() country?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  verificationStatus?: VerificationStatus;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  sanctionListMatchStatus?: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  PEPStatus?: string;
}

class PaymentInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() method?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() channel?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() issuer?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() gateway?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() acquirer?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  processor?: string;
}

class ProductInfo {
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() price?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() id?: string;
}

export class AlertCreateDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'ISO8061',
    example: '2021-01-01:00:00:00.000Z',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  date!: Date;
  @ApiProperty({ required: true }) @IsNumber() @IsNotEmpty() amount!: number;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() currency!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() projectId!: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  correlationId!: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() category?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type?: AlertType;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: AlertStatus;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  statusReason?: string;

  @ApiProperty({ type: SenderInfo }) @IsOptional() sender?: SenderInfo;
  @ApiProperty({ type: RecipientInfo }) @IsOptional() recipient?: RecipientInfo;
  @ApiProperty({ type: PaymentInfo }) @IsOptional() payment?: PaymentInfo;
  @ApiProperty({ type: ProductInfo }) @IsOptional() product?: ProductInfo;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  tags?: JsonValue | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reviewStatus?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reviewerComments?: string;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  auditTrail?: JsonValue | null;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  unusualActivityFlags?: JsonValue | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  riskScore?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  regulatoryAuthority?: string;
  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  additionalInfo?: JsonValue | null;

  @ApiProperty({ required: false }) @IsDate() @IsOptional() createdAt?: Date;
  @ApiProperty({ required: false }) @IsDate() @IsOptional() updatedAt?: Date;

  // Nullable relations
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  businessId?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endUserId?: string;
}
