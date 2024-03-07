import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCreatedDto {
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() id!: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() correlationId!: string;
}
