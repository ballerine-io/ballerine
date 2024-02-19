import { PageDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  businessId?: string;

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
  @IsEnum(['minutes', 'hours', 'days', 'months', 'years'])
  timeUnit?: 'minutes' | 'hours' | 'days' | 'months' | 'years';

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
