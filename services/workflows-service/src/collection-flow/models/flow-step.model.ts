import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class DocumentConfiguration {
  @IsString()
  name!: string;

  @IsString()
  type!: string;
}

export class FlowStepModel {
  @IsString()
  key!: string;

  @IsString()
  @IsOptional()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsObject()
  @IsOptional()
  uiSchema!: object;

  @IsObject()
  @IsOptional()
  formSchema!: object;

  @IsObject()
  @IsOptional()
  defaultData!: object;

  @IsBoolean()
  isFinal!: boolean;
}
