import { sortDirections } from '@/prisma/prisma.util';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import z, { ZodError } from 'zod';
import { SortableByModel } from './types';

// Interface for TransactionOrder
export interface ITransactionOrderDto {
  orderBy?: string; // Or use TransactionOrderOptions if it's a specific type
}

// Interface for Pagination
export interface IPageDto {
  page: number;
  limit: number;
}

export const validateOrderBy = (
  value: unknown,
  validColumns: readonly string[],
  ctx: z.RefinementCtx,
) => {
  if (typeof value !== 'string') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid orderBy: '${value}'. Must be one of ${validColumns.join(', ')}`,
      path: ['orderBy'], // The path where the error occurs
    });

    return z.NEVER;
  }

  const [column = '', direction = ''] = value.split(':');

  if (!validColumns.includes(column)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid orderBy column: '${value}'. Must be one of ${validColumns.join(', ')}`,
      path: ['orderBy'], // The path where the error occurs
    });
  }

  if (!sortDirections.includes(direction)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid orderBy direction: '${direction}'. Must be one of ${sortDirections.join(
        ', ',
      )}`,
      path: ['orderBy'], // The path where the error occurs
    });
  }
};

export type Pagination = Pick<Prisma.TransactionRecordFindManyArgs, 'take' | 'skip'>;

export const PageSchema = z.object({
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive().max(100),
  }),
});

export class PageDto {
  @ApiProperty({ name: 'page[number]', example: 1 })
  @Transform(({ value }) => +(value ?? 1))
  @IsNumber()
  @IsOptional()
  @Min(1)
  number!: number;

  @ApiProperty({ name: 'page[size]', example: 20 })
  @Transform(({ value }) => +(value ?? 10))
  @IsNumber()
  @IsOptional()
  @Min(1)
  size!: number;
}

Array<
  SortableByModel<Prisma.BusinessReportOrderByWithRelationInput>[number] | `business.${string}`
>;

export const OrderBySchema = (
  sortableColumns: Array<
    // TODO: Make this type generic
    SortableByModel<
      Prisma.AlertOrderByWithRelationInput | Prisma.BusinessReportOrderByWithRelationInput
    >[number]
  >,
) =>
  z.object({
    orderBy: z.string().superRefine((value, ctx) => validateOrderBy(value, sortableColumns, ctx)),
    // orderBy: z
    //   .custom<`${(typeof sortableColumns)[number]}:${(typeof sortDirections)[number]}`>(value =>
    //     validateOrderBy(value, sortableColumns),
    //   )
    //   .transform(value => {
    //     return buildOrderByGenericFilter({ orderBy: value });
    //   })
    //   .optional(),
  });

export class OrderBy {
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Column to sort by and direction separated by a colon',
    examples: [{ value: 'createdAt:asc' }, { value: 'status:asc' }],
  })
  orderBy?: `${string}:asc` | `${string}:desc`;
}

export const buildOrderByGenericFilter = <TColumn extends string>(params: {
  orderBy?: `${TColumn}:${Prisma.SortOrder}`;
  default?: `${TColumn}:${Prisma.SortOrder}`;
}): { [x: string]: Prisma.SortOrder } => {
  const orderByPartsas: [TColumn, Prisma.SortOrder] = (params?.orderBy?.split(':') ||
    params?.default || [undefined, undefined]) as [TColumn, Prisma.SortOrder];

  const [column, direction] = orderByPartsas;

  return {
    [column]: direction,
  };
};

export const buildPaginationFilter = (filters: PageDto | undefined) => {
  const args: Pagination = {};

  if (filters && filters) {
    // Temporary fix for pagination (class transformer issue)
    if (
      (Object.is(filters.number, undefined) || Object.is(filters.number, null)) &&
      (Object.is(filters.size, undefined) || Object.is(filters.size, null))
    ) {
      args.take = 10;
      args.skip = 0;
    } else {
      const size = parseInt((filters.size as unknown as string) || '10', 10);
      const number = parseInt((filters.number as unknown as string) || '1', 10);

      args.take = size;
      args.skip = size * (number - 1);
    }
  } else {
    args.take = 10;
    args.skip = 0;
  }

  return args;
};

export const buildOrderByFilter = <TColumn extends string>(
  orderBy: `${TColumn}:${Prisma.SortOrder}`,
) => {
  return buildOrderByGenericFilter(orderBy);
};

export class CommonFiltersDto {
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
  orderBy?: string;
}
const firstPageOptions = {
  take: 10,
  skip: 0,
};
export const firstPage = (() => {
  const page = new PageDto();
  page.number = 1;
  page.size = 10;
  return page;
})();
// TODO: create a decorator for easy pagination - TransformPageDecorator
