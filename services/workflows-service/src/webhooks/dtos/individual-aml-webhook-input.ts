import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class IndividualAmlWebhookInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsString()
  apiVersion!: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  timestamp!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  eventName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  entityId!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiProperty({
    required: true,
  })
  data!: unknown;
}
