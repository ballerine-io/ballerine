import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EndUserWhereUniqueInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}
