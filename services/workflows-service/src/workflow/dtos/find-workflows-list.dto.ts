import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

const sortDirections = ['asc', 'desc'] as const;
const sortableColumnsIndividuals = ['createdAt', 'firstName', 'lastName', 'email'] as const;
const sortableColumnsBusinesses = ['createdAt', 'companyName'] as const;

export class FindWorkflowsListDto {
  @ApiProperty()
  filterId!: string;

  @ApiProperty()
  orderBy!: string;
}

const validateOrderBy = (value: unknown, validColumns: readonly string[]) => {
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

export const FindWorkflowsListSchema = z.object({
  filterId: z.string(),
  orderBy: z.string(),
});

export const FindWorkflowsListQuerySchema = {
  individuals: z.object({
    orderBy:
      z.custom<`${(typeof sortableColumnsIndividuals)[number]}:${(typeof sortDirections)[number]}`>(
        value => validateOrderBy(value, sortableColumnsIndividuals),
      ),
  }),
  businesses: z.object({
    orderBy:
      z.custom<`${(typeof sortableColumnsBusinesses)[number]}:${(typeof sortDirections)[number]}`>(
        value => validateOrderBy(value, sortableColumnsBusinesses),
      ),
  }),
} as const;
