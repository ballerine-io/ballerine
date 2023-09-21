import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class DocumentPropertiesUpdateInput {
  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsObject()
  properties!: object;
}
