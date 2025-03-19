import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { PageDto } from '@/common/dto';
import {
  MERCHANT_REPORT_RISK_LEVELS_MAP,
  MERCHANT_REPORT_STATUSES,
  MERCHANT_REPORT_TYPES_MAP,
  type MerchantReportType,
} from '@ballerine/common';
import { BusinessReportDto } from '@/business-report/dtos/business-report.dto';

const MAX_REPORT_LIST_PAGE_SIZE = 1000;

export class BusinessReportListRequestParamDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  search?: string;

  @IsOptional()
  @ApiProperty({ type: PageDto })
  page?: PageDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  from?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  to?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  reportType?: MerchantReportType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  riskLevels?: Array<'low' | 'medium' | 'high' | 'critical'>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  statuses?: Array<'failed' | 'quality-control' | 'completed' | 'in-progress'>;

  isAlert?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  findings?: string[];
}

export const ListBusinessReportsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  reportType: z
    .enum([
      MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1,
      MERCHANT_REPORT_TYPES_MAP.ONGOING_MERCHANT_REPORT_T1,
    ])
    .optional(),
  riskLevels: z
    .array(
      z.enum([
        MERCHANT_REPORT_RISK_LEVELS_MAP.low,
        MERCHANT_REPORT_RISK_LEVELS_MAP.medium,
        MERCHANT_REPORT_RISK_LEVELS_MAP.high,
        MERCHANT_REPORT_RISK_LEVELS_MAP.critical,
      ]),
    )
    .optional(),
  statuses: z.array(z.enum(MERCHANT_REPORT_STATUSES)).optional(),
  findings: z.array(z.string()).optional(),
  search: z.string().optional(),
  isAlert: z
    .preprocess(value => (typeof value === 'string' ? JSON.parse(value) : value), z.boolean())
    .optional(),
  page: z
    .object({
      number: z.coerce.number().int().positive(),
      size: z.coerce.number().int().positive().max(MAX_REPORT_LIST_PAGE_SIZE),
    })
    .optional(),
});

export class BusinessReportListResponseDto {
  @ApiProperty({ type: Number, example: 20 })
  totalItems!: number;

  @ApiProperty({ type: Number, example: 1 })
  totalPages!: number;

  @ApiProperty({ type: [BusinessReportDto] })
  data!: BusinessReportDto[];
}
