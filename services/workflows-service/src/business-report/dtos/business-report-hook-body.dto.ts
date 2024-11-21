import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';
import { MERCHANT_REPORT_TYPES, type MerchantReportType } from '@/business-report/constants';

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
  @IsIn(MERCHANT_REPORT_TYPES)
  reportType!: MerchantReportType;

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
