import { ApiProperty } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { z } from 'zod';

class PageDto {
  @ApiProperty()
  number!: number;

  @ApiProperty()
  size!: number;
}

class FilterDto {
  @ApiProperty()
  assigneeId?: (string | null)[];

  @ApiProperty()
  status?: WorkflowRuntimeDataStatus[];
}

export class FindWorkflowsListDto {
  @ApiProperty()
  filterId!: string;

  @ApiProperty()
  orderBy!: string;

  @ApiProperty()
  page!: PageDto;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  filter?: FilterDto;
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
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive(),
  }),
  filter: z
    .object({
      assigneeId: z
        .array(z.union([z.literal('').transform(() => null), z.string().nonempty()]))
        .optional(),
      status: z.array(z.nativeEnum(WorkflowRuntimeDataStatus)).optional(),
    })
    .optional(),
});

const sortDirections = ['asc', 'desc'] as const;
const sortableColumnsIndividuals = ['createdAt', 'firstName', 'lastName', 'email'] as const;
const sortableColumnsBusinesses = ['createdAt', 'companyName'] as const;

export const FindWorkflowsListLogicSchema = {
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
