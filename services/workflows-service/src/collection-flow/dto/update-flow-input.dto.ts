import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsObject,
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

  @IsDate()
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
  @IsNotEmpty()
  fileId!: string;

  @IsObject()
  properties!: object;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
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

  @IsDate()
  birthDate!: string;

  @IsEmail()
  email!: string;
}

export class UpdateFlowPayload {
  @ValidateNested()
  @Type(() => MainRepresentative)
  mainRepresentative!: MainRepresentative;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyDocument)
  documents!: CompanyDocument[];

  @IsArray()
  // @ValidateNested({ each: true })
  ubos!: UBOShareholder[];

  @IsObject()
  dynamicData!: object;

  @IsNullable()
  @IsString()
  flowState!: string | null;
}

export class UpdateFlowDto {
  @IsString()
  flowType!: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdateFlowPayload)
  payload!: UpdateFlowPayload;
}
