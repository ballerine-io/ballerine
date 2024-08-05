import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TIME_UNITS } from '@/data-analytics/consts';
import type { TimeUnit } from '@/data-analytics/types';

export class GetTransactionsByAlertDto {
  @IsString()
  alertId?: string;

  @IsOptional()
  @IsString()
  counterpartyId?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsNumber()
  timeValue?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(Object.values(TIME_UNITS))
  timeUnit?: TimeUnit;

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
  orderBy?: `${string}:asc` | `${string}:desc`;

  @ApiProperty({ type: PageDto })
  page!: PageDto;
}

export class GetTransactionsDto {
  @IsOptional()
  @IsDateString()
  untilDate?: Date;

  @IsOptional()
  @IsString()
  counterpartyId?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsNumber()
  timeValue?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(Object.values(TIME_UNITS))
  timeUnit?: TimeUnit;

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
  orderBy?: `${string}:asc` | `${string}:desc`;

  @ApiProperty({ type: PageDto })
  page!: PageDto;
}
