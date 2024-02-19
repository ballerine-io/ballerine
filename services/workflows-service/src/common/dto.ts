import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
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

  // @ts-expect-error
  if (!sortDirections.includes(direction)) {
    throw new Error(`Invalid direction: ${direction}`);
  }

  return value;
};

export class PageDto {
  @ApiProperty({ name: 'page[number]', example: 1 })
  @Transform(({ value }) => parseInt(value, 10))
  number!: number;

  @ApiProperty({ name: 'page[size]', example: 20 })
  @Transform(({ value }) => parseInt(value, 10))
  size!: number;
}

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
