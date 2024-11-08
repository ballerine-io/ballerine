import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageDto } from '@/common/dto';
import { z } from 'zod';
import { BusinessReportDto } from '@/business-report/business-report.dto';

export class BusinessReportListRequestParamDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  search?: string;

  @ApiProperty({ type: PageDto })
  page!: PageDto;
}

export const ListBusinessReportsSchema = z.object({
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
