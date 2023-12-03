import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UiDefinitionByRuntimeIdDto } from '@/ui-definition/dtos/ui-definition-by-runtime-id.dto';
import type { CountryCode } from '@/common/countries';

export class UiDefinitionByRuntimeIdDocumentSchemaDto extends UiDefinitionByRuntimeIdDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  countryCode!: CountryCode;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  category!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  type!: string;
}
