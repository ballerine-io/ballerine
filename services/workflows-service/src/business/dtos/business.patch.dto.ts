import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BusinessUpdateDocumentsDto } from '@/business/dtos/business.update';
import { ApprovalState } from '@prisma/client';

export class BusinessPatchDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  correlationId?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  legalForm?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  countryOfIncorporation?: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  dateOfIncorporation?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  taxIdentificationNumber?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  vatNumber?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  shareholderStructure?: BusinessUpdateDocumentsDto[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  numberOfEmployees?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  businessPurpose?: string;

  @ValidateNested()
  @IsOptional()
  documents?: BusinessUpdateDocumentsDto;

  @ApiProperty({
    required: false,
    enum: ['APPROVED', 'REJECTED', 'PROCESSING', 'NEW'],
  })
  @IsOptional()
  @IsString()
  approvalState?: ApprovalState;

  @ApiProperty({ required: false })
  @IsOptional()
  additionalInfo?: Record<string, unknown>;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bankInformation?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  mccCode?: number;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
