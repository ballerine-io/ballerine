import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCollectionFlowUrlDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  workflowRuntimeDataId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  endUserId!: string;

  @ApiProperty({
    required: false,
    default: 30,
    type: Number,
    description: 'Default expiry in days',
  })
  @IsOptional()
  @IsNumber()
  expiry?: number;
}
