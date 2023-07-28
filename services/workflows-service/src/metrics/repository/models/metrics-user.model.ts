import { ApiProperty } from '@nestjs/swagger';

export class MetricsUserModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  lastActiveAt!: string;
}
