import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BusinessSelect {
  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  id?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  createdAt?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  updatedAt?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  companyName?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  registrationNumber?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  legalForm?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  countryOfIncorporation?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  dateOfIncorporation?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  address?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  phoneNumber?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  email?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  website?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  industry?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  taxIdentificationNumber?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  vatNumber?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  shareholderStructure?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  numberOfEmployees?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  businessPurpose?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  documents?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  approvalState?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  workflowRuntimeData?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  endUsers?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  endUsersOnBusinesses?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  _count?: boolean;
}
