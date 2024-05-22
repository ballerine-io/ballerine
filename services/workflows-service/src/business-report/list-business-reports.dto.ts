import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType, Prisma } from '@prisma/client';
import { IsIn, IsOptional } from 'class-validator';
import { PageDto, sortDirections, validateOrderBy } from '@/common/dto';
import { z } from 'zod';
import { SortableByModel } from '@/common/types';

export class ListBusinessReportsDto {
  @ApiProperty({
    required: true,
  })
  @IsIn(Object.values(BusinessReportType))
  type!: BusinessReportType;

  @ApiProperty({ type: PageDto })
  page!: PageDto;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Column to sort by and direction separated by a colon',
    examples: [
      { value: 'createdAt:asc' },
      { value: 'dataTimestamp:desc' },
      { value: 'status:asc' },
    ],
  })
  orderBy?: `${string}:asc` | `${string}:desc`;
}

const sortableColumnsAlerts: SortableByModel<Prisma.BusinessReportOrderByWithRelationInput> = [
  'createdAt',
  'updatedAt',
  'report',
];

export const ListBusinessReportsSchema = z.object({
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive().max(100),
  }),
  orderBy: z
    .custom<`${(typeof sortableColumnsAlerts)[number]}:${(typeof sortDirections)[number]}`>(value =>
      validateOrderBy(value, sortableColumnsAlerts),
    )
    .transform(value => {
      const [column = '', direction = ''] = value.split(':');

      if (!column || !direction) throw new Error('Invalid orderBy');

      return {
        [column]: direction,
      };
    })
    .optional(),
});
