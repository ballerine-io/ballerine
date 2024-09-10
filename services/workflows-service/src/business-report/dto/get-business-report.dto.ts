import { buildOrderByGenericFilter, PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType, Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { orderBy } from 'lodash';

type TBusniessReportOrderBy = 'createdAt' | 'status';

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
  @Transform(({ value }) =>
    buildOrderByGenericFilter({
      orderBy: value,
      default: 'createdAt:asc',
    }),
  )
  @IsEnum(['createdAt:asc', 'status:asc', 'createdAt:desc', 'status:desc'])
  orderBy?: Prisma.Enumerable<Prisma.BusinessReportOrderByWithRelationInput>;

  @ApiProperty({ type: PageDto })
  page!: PageDto;
}
