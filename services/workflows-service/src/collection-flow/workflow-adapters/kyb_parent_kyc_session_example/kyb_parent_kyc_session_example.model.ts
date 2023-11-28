import {
  CompanyDocument,
  MainRepresentative,
  UBOShareholder,
} from '@/collection-flow/dto/update-flow-input.dto';
import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { type WorkflowRuntimeData } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  flowState!: string | null;

  @IsString()
  status!: string;

  @IsObject()
  flowData!: object;

  @ValidateNested()
  mainRepresentative!: MainRepresentative;

  @ValidateNested({ each: true })
  documents!: CompanyDocument[];

  @ValidateNested({ each: true })
  ubos!: UBOShareholder[];

  @IsObject()
  workflow!: WorkflowRuntimeData;

  @IsObject()
  businessData!: Record<string, any>;

  @IsBoolean()
  isFinished!: boolean;
}
