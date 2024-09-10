import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

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
    enum: BusinessReportType,
    default: BusinessReportType.MERCHANT_REPORT_T1,
    description: 'Type of business report',
  })
  @IsEnum(BusinessReportType)
  type!: BusinessReportType;

  @ApiProperty({
    required: true,
    type: String,
    default: '2',
    description: 'Workflow version',
  })
  @IsString()
  workflowVersion!: '1' | '2' | '3';
}
