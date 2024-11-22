import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  workflowRuntimeDataId!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  endUserId?: string;

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
