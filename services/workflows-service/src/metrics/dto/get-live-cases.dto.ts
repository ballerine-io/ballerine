import { ApiProperty } from '@nestjs/swagger';

export class GetDailyLiveCasesDto {
  @ApiProperty()
  from!: string;

  @ApiProperty()
  to!: string;
}
