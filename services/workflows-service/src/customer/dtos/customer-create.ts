import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { TAuthenticationConfiguration } from '@/customer/types';
import {CustomerStatuses, Project} from '@prisma/client';

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
    type: String,
  })
  @IsString()
  language?: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
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
}
