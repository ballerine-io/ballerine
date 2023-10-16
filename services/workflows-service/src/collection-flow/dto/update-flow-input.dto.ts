import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BusinessUpdateDto } from '@/business/dtos/business.update';

export class MainRepresentative {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  phone!: string;

  @IsString()
  dateOfBirth!: string;

  @IsString()
  companyName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  title!: string;
}

export class CompanyDocument {
  @IsString()
  @IsOptional()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fileId!: string;

  @IsObject()
  properties!: object;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsOptional()
  uri!: string;

  @IsObject()
  @IsOptional()
  decision!: Record<string, any>;
}

export class UBOShareholder {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  title!: string;

  @IsString()
  birthDate!: string;

  @IsEmail()
  email!: string;
}

export class UpdateFlowPayload {
  @IsObject()
  business?: object;

  @IsString()
  ballerineEntityId?: string;

  @IsObject()
  endUser?: object;

  @IsObject()
  context!: object;
}

export class UpdateFlowDto {
  @ValidateNested()
  @IsNotEmpty()
  data!: UpdateFlowPayload;
}
