import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum ApprovalState {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class BusinessAddressDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  country?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  countryCode?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  city?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  street?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  postcode?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  state?: string;
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
  @Optional()
  registrationNumber?: string;

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
  @Optional()
  mccCode?: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @Optional()
  businessType?: string;

  @ApiProperty({ type: BusinessAddressDto })
  @Optional()
  address?: BusinessAddressDto;
}
