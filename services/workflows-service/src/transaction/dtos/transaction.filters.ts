import { PaymentMethod } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransactionFilters {
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
}
