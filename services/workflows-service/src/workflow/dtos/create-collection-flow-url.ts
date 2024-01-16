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
  })
  @IsOptional()
  @IsNumber()
  expiry!: number;
}
