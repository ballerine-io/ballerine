import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultContextSchema } from '@ballerine/common';

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
  @IsNumber()
  apiVersion!: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  timestamp!: number;

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
  data!: DefaultContextSchema['aml'];
}
