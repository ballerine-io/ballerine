import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EndUserCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  lastName!: string;
}
