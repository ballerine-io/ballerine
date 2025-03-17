import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class GetDocumentsByIdsDto {
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  ids!: string[];
}
