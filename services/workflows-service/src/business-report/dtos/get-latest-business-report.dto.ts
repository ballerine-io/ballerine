import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MERCHANT_REPORT_TYPES, type MerchantReportType } from '@ballerine/common';

export class GetLatestBusinessReportDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessId!: string;

  @ApiProperty({
    required: false,
  })
  @IsIn(Object.values(MERCHANT_REPORT_TYPES))
  @IsOptional()
  type?: MerchantReportType;
}
