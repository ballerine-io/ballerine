import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { countryCodes } from '@ballerine/common';
import {
  MERCHANT_REPORT_TYPES,
  MERCHANT_REPORT_TYPES_MAP,
  MERCHANT_REPORT_VERSIONS_MAP,
  type MerchantReportType,
  type MerchantReportVersion,
} from '@/business-report/constants';

export class CreateBusinessReportDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @MinLength(1)
  @IsString()
  businessCorrelationId?: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'https://www.example.com',
  })
  @MinLength(1)
  @IsString()
  websiteUrl!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @MinLength(1)
  @IsString()
  merchantName?: string;

  @ApiProperty({
    required: false,
    type: String,
    enum: countryCodes,
    default: 'GB',
  })
  @IsOptional()
  @IsIn(Object.values(countryCodes))
  countryCode?: (typeof countryCodes)[number];

  @ApiProperty({
    required: true,
    type: String,
    example: MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1,
  })
  @IsIn(Object.values(MERCHANT_REPORT_TYPES))
  reportType!: MerchantReportType;

  @ApiProperty({
    required: true,
    type: String,
    enum: MERCHANT_REPORT_VERSIONS_MAP,
    default: MERCHANT_REPORT_VERSIONS_MAP['2'],
    description: 'Workflow version',
  })
  @IsString()
  workflowVersion!: MerchantReportVersion;
}
