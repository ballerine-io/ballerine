import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';
import { BulkStatus } from '@/alert/types';
import { Optional } from '@nestjs/common';

export class BulkTransactionsCreatedDto {
  @ApiProperty({ required: true, enum: BulkStatus }) @IsEnum(BulkStatus) status!: typeof BulkStatus;

  @ApiProperty({ required: false }) @Optional() @IsString() @IsNotEmpty() error?: string;

  @ApiProperty({ type: TransactionCreatedDto })
  @ValidateNested()
  @Type(() => TransactionCreatedDto)
  data!: TransactionCreatedDto;
}
