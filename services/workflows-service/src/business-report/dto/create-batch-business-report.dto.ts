import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BusinessReportType } from '@prisma/client';

export class CreateBatchBusinessReportDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file for batch business report',
  })
  file!: Express.Multer.File;

  @ApiProperty({
    enum: BusinessReportType,
    description: 'Type of business report',
    example: BusinessReportType.MERCHANT_REPORT_T1_LITE,
  })
  @IsEnum(BusinessReportType)
  type!: BusinessReportType;
}
