import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsArray, IsOptional } from 'class-validator';

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
