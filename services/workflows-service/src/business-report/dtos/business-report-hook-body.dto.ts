import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';
import { BusinessReportType } from '@prisma/client';
import type { ObjectValues } from '@/types';

export class BusinessReportHookBodyDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  reportId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsIn(Object.values(BusinessReportType))
  reportType!: ObjectValues<typeof BusinessReportType>;

  @ApiProperty({
    required: true,
    type: Object,
  })
  reportData!: Record<string, unknown>;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  base64Pdf!: string;
}
