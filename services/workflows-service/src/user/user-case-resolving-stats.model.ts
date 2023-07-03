import { ApiProperty } from '@nestjs/swagger';

export class UserCaseResolvingStatsModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  cases!: number;

  @ApiProperty()
  email!: string;
}
