import { PageDto, validateOrderBy } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { AlertStatus, Alert, Prisma } from '@prisma/client';
import { z } from 'zod';

export class FilterDto {
  @ApiProperty({ type: [String] })
  assigneeId?: Array<string>;

  @ApiProperty({ enum: AlertStatus, type: [String] })
  status?: AlertStatus[];
}

export class FindAlertsDto {
  @ApiProperty()
  search?: string;

  @ApiProperty({ type: PageDto })
  page!: PageDto;

  @ApiProperty({ type: FilterDto })
  filter?: FilterDto;

  @ApiProperty()
  orderBy?: string;
}

type SortableProperties<T> = {
  [K in keyof T]: T[K] extends Prisma.SortOrder | undefined ? K : never;
}[keyof T];

// Test type
type SortableByModel<T> = Exclude<SortableProperties<T>, undefined>[];

const sortableColumnsAlerts: SortableByModel<Prisma.AlertOrderByWithRelationInput> = [
  'createdAt',
  'status',
];

const sortDirections: (keyof typeof Prisma.SortOrder)[] = ['asc', 'desc'];

export const FindAlertsSchema = z.object({
  search: z.string().length(150).optional(),
  page: z.object({
    number: z.coerce.number().int().positive(),
    size: z.coerce.number().int().positive().max(100),
  }),
  orderBy: z
    .custom<`${(typeof sortableColumnsAlerts)[number]}:${(typeof sortDirections)[number]}`>(value =>
      validateOrderBy(value, sortableColumnsAlerts),
    )
    .optional(),
  filter: z
    .object({
      assigneeId: z
        .array(z.union([z.literal('').transform(() => null), z.string().min(1)]))
        .optional(),
      status: z.array(z.nativeEnum(AlertStatus)).optional(),
    })
    .optional(),
});
