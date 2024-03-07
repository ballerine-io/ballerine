import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';

export class BulkTransactionsCreatedDto {
  @ApiProperty({ required: true }) @IsNumber() status!: number;

  @ApiProperty({ type: TransactionCreatedDto })
  @ValidateNested()
  @Type(() => TransactionCreatedDto)
  data!: TransactionCreatedDto;
}
