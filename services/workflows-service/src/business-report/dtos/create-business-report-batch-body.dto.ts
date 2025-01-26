import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  MERCHANT_REPORT_TYPES_MAP,
  MERCHANT_REPORT_VERSIONS_MAP,
  type MerchantReportType,
  type MerchantReportVersion,
} from '@/business-report/constants';

export class CreateBusinessReportBatchBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file for batch business report',
  })
  file!: Express.Multer.File;

  @ApiProperty({
    required: true,
    type: String,
    enum: MERCHANT_REPORT_TYPES_MAP,
    default: MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1,
    description: 'Type of business report',
  })
  @IsEnum(MERCHANT_REPORT_TYPES_MAP)
  type!: MerchantReportType;

  @ApiProperty({
    required: true,
    type: String,
    enum: MERCHANT_REPORT_VERSIONS_MAP,
    default: MERCHANT_REPORT_VERSIONS_MAP['2'],
    description: 'Workflow version',
  })
  @IsEnum(MERCHANT_REPORT_VERSIONS_MAP)
  workflowVersion!: MerchantReportVersion;
}
