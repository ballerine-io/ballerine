import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserAssignedCasesStatisticModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  @Transform(({ value }) => (value === null ? 0 : value))
  casesCount!: number;
}
