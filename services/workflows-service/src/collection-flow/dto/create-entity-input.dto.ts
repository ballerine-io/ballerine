import { ApiProperty } from '@nestjs/swagger';
import { BusinessPosition } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class EntityCreateDto {
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
}

export class CreateEntityInputDto {
  @IsString()
  entityType!: BusinessPosition;

  @IsObject()
  @ValidateNested()
  @Type(() => EntityCreateDto)
  entity!: EntityCreateDto;
}
