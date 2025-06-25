import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CaseRevisionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  documentIds!: string[];
}
