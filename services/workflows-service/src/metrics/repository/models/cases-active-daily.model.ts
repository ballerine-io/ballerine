import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CasesActiveDailyModel {
  @ApiProperty()
  @IsNumber()
  count!: number;

  @ApiProperty()
  @IsString()
  date!: string;
}
