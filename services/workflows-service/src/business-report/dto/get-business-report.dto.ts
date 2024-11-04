import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { MERCHANT_REPORT_TYPES, type MerchantReportType } from '@/business-report/constants';

export class GetBusinessReportDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({
    required: true,
  })
  @IsIn(MERCHANT_REPORT_TYPES)
  type!: MerchantReportType;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Column to sort by and direction separated by a colon',
    examples: [{ value: 'createdAt:asc' }, { value: 'status:asc' }],
  })
  orderBy?: `${string}:asc` | `${string}:desc`;

  @ApiProperty({ type: PageDto })
  page!: PageDto;
}
