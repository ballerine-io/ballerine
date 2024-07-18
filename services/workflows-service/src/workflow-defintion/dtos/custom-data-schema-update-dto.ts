import { ApiProperty } from '@nestjs/swagger';

export class CustomDataSchemaUpdateDto {
  @ApiProperty({
    required: true,
    type: Object,
  })
  schema!: Record<string, unknown>;
}
