import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { PageDto } from '@/common/dto';
import { MERCHANT_REPORT_TYPES_MAP, type MerchantReportType } from '@/business-report/constants';
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
  riskLevel?: Array<'low' | 'medium' | 'high' | 'critical'>;
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
  riskLevel: z.array(z.enum(['low', 'medium', 'high', 'critical'])).optional(),
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
