import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserWhereUniqueInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}
