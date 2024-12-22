import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageDto } from '@/common/dto';
import { z } from 'zod';
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
}

export const ListBusinessReportsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
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
