import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export const sortDirections: Array<keyof typeof Prisma.SortOrder> = ['asc', 'desc'];

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

export class PageDto {
  @ApiProperty({ name: 'page[number]', example: 1, default: 1 })
  @Transform(({ value }) => +(value ?? 1))
  @IsNumber()
  @Min(1)
  number: number = 1;

  @ApiProperty({ name: 'page[size]', example: 20, default: 10 })
  @Transform(({ value }) => +(value ?? 10))
  @IsNumber()
  @Min(1)
  size: number = 10;
}

export const buildPaginationFilter = (filters: PageDto | undefined) => {
  const args: {
    take?: number;
    skip?: number;
  } = {};

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
