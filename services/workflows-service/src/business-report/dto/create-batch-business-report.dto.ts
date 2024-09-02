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
    required: true,
    type: String,
    enum: BusinessReportType,
    default: BusinessReportType.MERCHANT_REPORT_T1_LITE,
    description: 'Type of business report',
  })
  @IsEnum(BusinessReportType)
  type!: BusinessReportType;
}
