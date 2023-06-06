import { ApiProperty } from '@nestjs/swagger';

export class IntentDto {
  @ApiProperty()
  intentName!: string;
  @ApiProperty()
  entityId!: string;
}
