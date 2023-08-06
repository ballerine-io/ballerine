import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BusinessUpdateDocumentsDto {
  @IsOptional()
  registrationDocument!: string;

  @IsOptional()
  financialStatement!: string;
}

export class BusinessUpdateShareholders {
  @IsString()
  name!: string;
}

export class BusinessUpdateDto {
  @IsOptional()
  companyName!: string;

  @IsOptional()
  registrationNumber!: string;

  @IsOptional()
  address!: string;

  @IsOptional()
  website!: string;

  @ValidateNested()
  documents!: BusinessUpdateDocumentsDto;

  @IsArray()
  @ValidateNested()
  shareholderStructure!: BusinessUpdateDocumentsDto[];
}
