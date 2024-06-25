import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export const CONFIGURATION_UPDATE_STRATEGY = ['patch', 'delete', 'put'] as const;
export type TConfigurationUpdateStrategy = (typeof CONFIGURATION_UPDATE_STRATEGY)[number];

export class UIElement {
  @IsString()
  name!: string;

  elements?: UIElement[];
}

export class UpdateConfigurationDto {
  @IsOptional()
  @IsArray()
  elements?: UIElement[];

  @IsObject()
  @IsOptional()
  theme?: object;
}
