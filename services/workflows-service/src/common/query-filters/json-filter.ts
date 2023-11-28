import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import type { InputJsonValue } from '../../types';

export class JsonFilter {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  equals?: InputJsonValue;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  not?: InputJsonValue;
}
