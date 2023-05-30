import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EndUserWhereInput } from './end-user-where-input';
import { EndUserOrderByInput } from './end-user-order-by-input';
import { IsIn } from 'class-validator';
import { z } from 'zod';

class CursorPaginationDto {
  @ApiProperty()
  size!: number;

  @ApiProperty({ required: false })
  after?: string;
}

export class FindEndUsersListInternalDto {
  @ApiProperty({ required: false })
  orderBy?: string;

  @ApiProperty()
  page!: CursorPaginationDto;

  @ApiProperty()
  filterId!: string;

  // @TODO: Add filters
}

const validOrderByColumns = ['id', 'createdAt', 'updatedAt', 'email'] as const;

const isValidOrderBy = (orderBy: string) => {
  if (orderBy === '') {
    return true;
  }

  return orderBy.split(',').every(orderByPart => {
    const orderByColumn = orderByPart.startsWith('-') ? orderByPart.slice(1) : orderByPart;

    return validOrderByColumns.includes(orderByColumn as never);
  });
};

export const FindEndUsersListInternalSchema = z.object({
  orderBy: z.string().refine(isValidOrderBy).optional(),
  page: z.object({
    size: z.coerce.number(),
    after: z.string().optional(), // @TODO: Validate that it's a valid cursor
  }),
  filterId: z.string(),
  // @TODO: Add filters
});
