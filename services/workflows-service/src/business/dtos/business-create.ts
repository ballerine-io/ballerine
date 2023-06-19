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
    required: true,
    type: String,
  })
  @IsString()
  registrationNumber!: string;
}
