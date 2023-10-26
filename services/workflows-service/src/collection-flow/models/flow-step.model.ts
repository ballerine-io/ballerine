import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentConfiguration {
  @IsString()
  name!: string;

  @IsString()
  type!: string;
}

export class UiSchemaStep {
  @IsString()
  type!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  stateName?: string;

  @IsObject()
  elements!: object;

  @IsObject()
  @IsOptional()
  actions?: object;
}

export class UiDefDefinition {
  @IsString()
  id!: string;

  @IsString()
  initial!: string;

  @IsObject()
  @IsOptional()
  context?: string;

  @IsObject()
  states!: string;

  @IsObject()
  @IsOptional()
  extensions?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  predictableActionArguments?: boolean;
}
