import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContextInputDto {
  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsObject()
  context!: Record<string, unknown>;
}
