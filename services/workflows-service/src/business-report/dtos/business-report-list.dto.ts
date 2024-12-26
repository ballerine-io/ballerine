import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { PageDto } from '@/common/dto';
import {
  MERCHANT_REPORT_RISK_LEVELS,
  MERCHANT_REPORT_STATUSES_MAP,
  MERCHANT_REPORT_TYPES_MAP,
  type MerchantReportType,
} from '@/business-report/constants';
import { BusinessReportDto } from '@/business-report/dtos/business-report.dto';

export class BusinessReportListRequestParamDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  search?: string;

  @ApiProperty({ type: PageDto })
  page!: PageDto;

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
        MERCHANT_REPORT_RISK_LEVELS.low,
        MERCHANT_REPORT_RISK_LEVELS.medium,
        MERCHANT_REPORT_RISK_LEVELS.high,
        MERCHANT_REPORT_RISK_LEVELS.critical,
      ]),
    )
    .optional(),
  statuses: z
    .array(
      z.enum([
        MERCHANT_REPORT_STATUSES_MAP.failed,
        MERCHANT_REPORT_STATUSES_MAP.completed,
        MERCHANT_REPORT_STATUSES_MAP['in-progress'],
        MERCHANT_REPORT_STATUSES_MAP['quality-control'],
      ]),
    )
    .optional(),
  findings: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive().max(100),
  }),
});

export class BusinessReportListResponseDto {
  @ApiProperty({ type: Number, example: 20 })
  totalItems!: number;

  @ApiProperty({ type: Number, example: 1 })
  totalPages!: number;

  @ApiProperty({ type: [BusinessReportDto] })
  data!: BusinessReportDto[];
}
