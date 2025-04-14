import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class GetDailyLiveCasesDto {
  @ApiProperty()
  @Optional()
  from?: string;

  @ApiProperty()
  @Optional()
  to?: string;
}
