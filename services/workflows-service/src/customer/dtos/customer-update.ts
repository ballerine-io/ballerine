import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CustomerStatuses } from '@prisma/client';

export class CustomerUpdateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  customerStatus?: CustomerStatuses;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  logoImageUri?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  faviconImageUri?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ required: false, type: 'object' })
  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @ApiProperty({
    type: String,
    description: 'Customer ID in HubSpot CRM',
    required: false,
  })
  @IsString()
  @IsOptional()
  hubspotCustomerId?: string;
}
