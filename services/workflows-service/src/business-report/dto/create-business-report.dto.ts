import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { countryCodes } from '@ballerine/common';
import { BusinessReportType } from '@prisma/client';
import type { ObjectValues } from '@/types';

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
  })
  @IsOptional()
  @IsIn(Object.values(countryCodes))
  countryCode?: (typeof countryCodes)[number];

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsIn(Object.values(BusinessReportType))
  reportType!: ObjectValues<typeof BusinessReportType>;
}
