import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CustomerModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

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
  customerStatus?: string;

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
  language?: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
  country?: string;
}

export class Subscription {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  events!: string[];

  @ApiProperty({
    example: 'webhook',
    default: 'webhook',
  })
  type!: string;
}
