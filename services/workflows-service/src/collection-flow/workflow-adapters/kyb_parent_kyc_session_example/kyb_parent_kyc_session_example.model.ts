import {
  CompanyDocument,
  MainRepresentative,
  UBOShareholder,
} from '@/collection-flow/dto/update-flow-input.dto';
import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

export class PersonalInformationName {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;
}

export class CompanyDocuments {
  @IsArray()
  @ValidateNested({ each: true })
  documents!: CompanyDocument[];
}

export class KYBParentKYCSessionExampleFlowData {
  @IsString()
  id!: string;

  @IsString()
  @IsNullable()
  state!: string | null;

  @IsObject()
  flowData!: object;

  @ValidateNested()
  mainRepresentative!: MainRepresentative;

  @ValidateNested({ each: true })
  documents!: CompanyDocument[];

  @ValidateNested({ each: true })
  ubos!: UBOShareholder[];
}
