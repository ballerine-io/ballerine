import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class TransactionCreatedDto {
  @ApiProperty({ required: false }) @IsString() @Optional() @IsNotEmpty() id?: string;
  @ApiProperty({ required: true }) @IsString() @IsNotEmpty() correlationId!: string;
}
