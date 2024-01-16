import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCollectionFlowUrlDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  workflowRuntimeDataId!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
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
