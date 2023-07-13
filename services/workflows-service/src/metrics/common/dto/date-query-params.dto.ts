import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DateQueryParamsDto {
  @ApiProperty({ type: Number, description: 'UNIX timestamp' })
  @Transform(({ value }) => new Date(value ? +value : 0))
  @IsDate()
  fromDate!: Date;
}
