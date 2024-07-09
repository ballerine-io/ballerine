import { ApiProperty } from '@nestjs/swagger';
import { BusinessReportType, Prisma } from '@prisma/client';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PageDto, sortDirections, validateOrderBy } from '@/common/dto';
import { z } from 'zod';
import { SortableByModel } from '@/common/types';

export class ListBusinessReportsDto {
  @IsOptional()
  @IsString()
  businessId?: string;

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

const sortableColumnsAlerts: Array<
  SortableByModel<Prisma.BusinessReportOrderByWithRelationInput>[number] | `business.${string}`
> = [
  'createdAt',
  'updatedAt',
  'business.website',
  'business.companyName',
  'business.country',
  'riskScore',
  'status',
];

const toOrderBy = (orderBy: string) => {
  const [column = '', direction = ''] = orderBy.split(':');

  if (!column || !direction) throw new Error('Invalid orderBy');

  return {
    [column]: direction,
  };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESLint doesn't like recursion
// @ts-ignore
const buildNestedObjectDeep = ({ keys, value }: { keys: string[]; value: string }) => {
  if (keys.length === 0) return value;

  const [firstKey, ...restKeys] = keys;

  if (!firstKey) return value;

  return {
    [firstKey]: buildNestedObjectDeep({
      keys: restKeys,
      value,
    }),
  };
};

const toRelationalOrderBy = (orderBy: string) => {
  const [column = '', direction = ''] = orderBy.split(':');
  const keys = column.split('.');

  return buildNestedObjectDeep({
    keys,
    value: direction,
  });
};

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
      if (value.includes('.')) {
        return toRelationalOrderBy(value);
      }

      return toOrderBy(value);
    })
    .optional(),
});
