import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import { BusinessPosition } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

export class EntityCreateDto extends EndUserCreateDto {}

export class CreateEntityInputDto {
  @IsString()
  entityType!: BusinessPosition;

  @IsObject()
  @ValidateNested()
  @Type(() => EntityCreateDto)
  entity!: EntityCreateDto;
}
