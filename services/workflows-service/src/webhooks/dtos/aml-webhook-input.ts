import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AmlWebhookInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  entityType!: string;
}
