import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { countryCodes } from '@ballerine/common';
import { BusinessReportType } from '@prisma/client';

export class CreateBatchBusinessReportDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file for batch business report',
  })
  @IsString()
  reportBatchCsv!: Express.Multer.File;

  @ApiProperty({
    enum: BusinessReportType,
    description: 'Type of business report',
    example: BusinessReportType.MERCHANT_REPORT_T1_LITE,
  })
  @IsEnum(BusinessReportType)
  type!: BusinessReportType;

  @ApiProperty({ description: 'Country code for the report' })
  @IsIn(countryCodes)
  @IsOptional()
  countryCode?: string;
}
