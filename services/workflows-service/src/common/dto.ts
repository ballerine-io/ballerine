import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import type { SetOptional } from 'type-fest';
import { Direction, sortDirections } from '@/prisma/prisma.util';

// Interface for TransactionOrder
export interface ITransactionOrderDto {
  orderBy?: string; // Or use TransactionOrderOptions if it's a specific type
}

// Interface for Pagination
export interface IPageDto {
  page: number;
  limit: number;
}

export const validateOrderBy = (value: unknown, validColumns: readonly string[]) => {
  if (typeof value !== 'string') {
    throw new Error('Invalid orderBy');
  }

  const [column = '', direction = ''] = value.split(':');

  if (!validColumns.includes(column)) {
    throw new Error(`Invalid column: ${column}`);
  }

  if (!sortDirections.includes(direction)) {
    throw new Error(`Invalid direction: ${direction}`);
  }

  return value;
};

export type Pagination = Pick<Prisma.TransactionRecordFindManyArgs, 'take' | 'skip'>;

export class PageDto {
  @ApiProperty({ name: 'page[number]', example: 1 })
  @Transform(({ value }) => +(value ?? 1))
  number!: number;

  @ApiProperty({ name: 'page[size]', example: 20 })
  @Transform(({ value }) => +(value ?? 10))
  size!: number;
}

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

export const buildOrderByGenericFilter = <TColumn extends string>(
  orderBy: `${TColumn}:${Prisma.SortOrder}`,
): { [x: string]: Prisma.SortOrder } => {
  const [column, direction] = orderBy.split(':') as [TColumn, Prisma.SortOrder];

  return {
    [column]: direction,
  };
};

export const buildPaginationFilter = (
  filters:
    | {
        page: PageDto | undefined;
      }
    | undefined,
) => {
  const args: Pagination = {};

  if (filters && filters.page) {
    // Temporary fix for pagination (class transformer issue)
    if (!filters?.page.number || !filters?.page.size) {
      args.take = 10;
    } else {
      const size = parseInt(filters.page.size as unknown as string, 10);
      const number = parseInt(filters.page.number as unknown as string, 10);

      args.take = size;
      args.skip = size * (number - 1);
    }
  } else {
    args.take = 10;
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

export const firstPage = (() => {
  const page = new PageDto();
  page.number = 1;
  page.size = 10;
  return page;
})();

export const TransformPageDecorator = ({ value }: { value: PageDto }) =>
  value
    ? {
        take: value.size,
        skip: (value.number - 1) * value.size,
      }
    : firstPage;
