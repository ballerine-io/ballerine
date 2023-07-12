import { ApiProperty } from '@nestjs/swagger';

export class ActiveUserModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  lastActiveAt!: string;
}
