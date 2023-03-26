import { ApiProperty } from '@nestjs/swagger';

export class MetaQueryPayload {
  @ApiProperty({
    required: true,
    type: [Number],
  })
  count!: number;
}
