import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import type { TAuthenticationConfiguration } from '@/customer/types';
import { CustomerStatuses } from '@prisma/client';

export class CustomerCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  displayName!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  customerStatus?: CustomerStatuses;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  logoImageUri!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  faviconImageUri!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    type: Object,
  })
  @IsObject()
  authenticationConfiguration?: TAuthenticationConfiguration;

  @ApiProperty({
    type: String,
  })
  @IsString()
  projectName?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;
}
