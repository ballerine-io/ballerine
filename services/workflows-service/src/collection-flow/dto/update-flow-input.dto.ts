import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  properties!: Record<string, unknown>;

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
  business?: Record<string, unknown>;

  @IsString()
  ballerineEntityId?: string;

  @IsObject()
  endUser?: Record<string, unknown>;

  @IsObject()
  context!: Record<string, unknown>;
}

export class UpdateFlowDto {
  @ValidateNested()
  @IsNotEmpty()
  data!: UpdateFlowPayload;
}

export class UpdateFlowLanguageDto {
  @IsString()
  language!: string;
}
