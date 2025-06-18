import { oneOf } from '@/common/decorators/one-of.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { EndUserVariant } from '@prisma/client';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEntityInputDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  email?: string;

  @IsOptional()
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  isContactPerson?: boolean;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  phone?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  country?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsObject()
  additionalInfo?: Record<string, any>;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  companyName?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @oneOf([EndUserVariant.director, EndUserVariant.ubo])
  variant?: EndUserVariant;
}
