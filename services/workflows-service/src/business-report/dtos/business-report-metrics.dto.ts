import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { z } from 'zod';

export class BusinessReportMetricsRequestQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  from?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  to?: string;
}

export const BusinessReportsMetricsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});
