import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import type { InputJsonValue } from '../../types';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: InputJsonValue;
}
