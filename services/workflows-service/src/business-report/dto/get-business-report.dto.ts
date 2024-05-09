import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType } from '@prisma/client';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetBusinessReportDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({
    required: true,
  })
  @IsIn(Object.values(BusinessReportType))
  type!: BusinessReportType;

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
