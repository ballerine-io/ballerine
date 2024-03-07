import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum ApprovalState {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class BusinessCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  companyName!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  registrationNumber!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  correlationId!: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsString()
  mccCode!: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  businessType!: string;
}
