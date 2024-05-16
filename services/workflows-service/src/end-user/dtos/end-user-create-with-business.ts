import { IsOptional } from 'class-validator';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';

export class EndUserCreateWithBusinessDto extends EndUserCreateDto {
  @IsOptional()
  companyName!: string;
}
