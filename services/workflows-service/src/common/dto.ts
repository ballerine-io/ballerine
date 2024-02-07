import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ZodError, ZodIssueCode } from 'zod';

export const sortDirections: (keyof typeof Prisma.SortOrder)[] = ['asc', 'desc'];

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
  number!: number;

  @ApiProperty({ name: 'page[size]', example: 20 })
  size!: number;
}
