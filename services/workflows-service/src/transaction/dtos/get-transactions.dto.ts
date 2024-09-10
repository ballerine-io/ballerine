import {
  firstPage,
  PageDto,
  buildOrderByGenericFilter,
  buildPaginationFilter,
  OrderBySchema,
  PageSchema,
} from '@/common/dto';
import type { Pagination } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, Prisma, TransactionRecord } from '@prisma/client';
import { IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { TIME_UNITS } from '@/data-analytics/consts';
import type { TimeUnit } from '@/data-analytics/types';
import { Transform, Type } from 'class-transformer';
import { Direction } from '@/prisma/prisma.util';
import { SortOrder } from '@/common/query-filters/sort-order';
import { first, orderBy } from 'lodash';
import { string, z } from 'zod';

export class SubjectDto {
  @IsOptional()
  @IsString()
  counterpartyOriginatorId?: string;

  @IsOptional()
  @IsString()
  counterpartyBeneficiaryId?: string;
}

export type TransactionsOrderBy = Prisma.Enumerable<
  Pick<Prisma.TransactionRecordFindManyArgs, 'skip' | 'take' | 'orderBy'>
>;

type TransactionSortableColumn = 'createdAt' | 'dataTimestamp' | 'status';
type SortOrderType = (typeof SortOrder)[keyof typeof SortOrder];

type TransactionOrderBy = {
  [key in `${TransactionSortableColumn}`]: `${SortOrderType}`;
};

const TransactionOrderByOptions: TransactionOrderBy = {
  createdAt: 'desc',
  dataTimestamp: 'asc',
  status: 'desc',
} as const;

type TransactionOrderOptions = `${TransactionSortableColumn}:${SortOrderType}`;

const TransactionOrderByEnum: TransactionOrderOptions[] = [
  'createdAt:asc',
  'createdAt:desc',
  'dataTimestamp:asc',
  'dataTimestamp:desc',
  'status:asc',
  'status:desc',
];

class TransactionOrderDto {
  @IsOptional()
  @IsEnum(TransactionOrderByEnum)
  @ApiProperty({
    required: false,
    type: String,
    enum: TransactionOrderByEnum,
    description: 'Column to sort by and direction separated by a colon',
    examples: ['createdAt:asc', 'dataTimestamp:desc', 'status:asc'],
  })
  @Transform(({ value }) =>
    buildOrderByGenericFilter({
      orderBy: value,
      default: 'dataTimestamp:desc',
    }),
  )
  orderBy?: Prisma.Enumerable<Prisma.TransactionRecordOrderByWithRelationInput>;
}

// export class GetTransactionsDto extends TransactionOrderDto {
//   @IsOptional()
//   @IsString()
//   counterpartyId?: string;

//   @IsOptional()
//   @IsIn(Object.values(PaymentMethod))
//   paymentMethod?: PaymentMethod;

//   @IsOptional()
//   @IsDateString()
//   startDate?: Date;

//   @IsOptional()
//   @IsDateString()
//   endDate?: Date;

//   @IsOptional()
//   @ApiProperty({ type: SubjectDto })
//   subject!: SubjectDto;

//   @ApiProperty({ type: PageDto })
//   @Type(() => PageDto)
//   @Transform(({ value }) => buildPaginationFilter({ page: value } as any))
//   page!: Pagination;
// }

export const GetTransactionsByAlertSchema = OrderBySchema(TransactionOrderByEnum as any)
  .merge(PageSchema)
  .merge(
    z.object({
      alertId: z.string(),
    }),
  );

export class GetTransactionsByAlertDto {
  // extends TransactionOrderDto {
  @IsString()
  alertId!: string;

  @ApiProperty({ type: PageDto })
  @Type(() => PageDto) // Use Type decorator for class-transformer
  page!: PageDto;

  @IsOptional()
  @IsEnum(TransactionOrderByEnum)
  @ApiProperty({
    required: false,
    type: String,
    enum: TransactionOrderByEnum,
    description: 'Column to sort by and direction separated by a colon',
    examples: ['createdAt:asc', 'dataTimestamp:desc', 'status:asc'],
  })
  @Transform(({ value }) =>
    buildOrderByGenericFilter({
      orderBy: value,
      default: 'dataTimestamp:desc',
    }),
  )
  orderBy?: Prisma.Enumerable<Prisma.TransactionRecordOrderByWithRelationInput>;
}
