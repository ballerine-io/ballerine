import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class FilterCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    enum: ['individuals', 'businesses'],
  })
  @IsEnum(['individuals', 'businesses'])
  entity!: string;

  @ApiProperty({
    required: true,
  })
  query!: Record<string, any>;
}
