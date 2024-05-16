import { PageDto, sortDirections, validateOrderBy } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import { z } from 'zod';

class FilterDto {
  @ApiProperty()
  assigneeId?: Array<string | null>;

  @ApiProperty()
  status?: WorkflowRuntimeDataStatus[];

  @ApiProperty()
  caseStatus?: string[];
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
  search?: string;

  @ApiProperty()
  filter?: FilterDto;
}

export const FindWorkflowsListSchema = z.object({
  filterId: z.string(),
  orderBy: z.string(),
  search: z.string().optional(),
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
      caseStatus: z.array(z.string()).optional(),
    })
    .optional(),
});

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
