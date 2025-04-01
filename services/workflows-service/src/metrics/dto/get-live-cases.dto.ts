import { ApiProperty } from '@nestjs/swagger';

export class GetDailyLiveCasesDto {
  @ApiProperty()
  from!: Date;

  @ApiProperty()
  to!: Date;
}
