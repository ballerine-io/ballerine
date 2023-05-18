import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  entity!: string;
}
