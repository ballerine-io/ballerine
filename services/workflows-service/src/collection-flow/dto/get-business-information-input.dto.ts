import { IsNullable } from '@/common/decorators/is-nullable.decorator';
import { IsOptional, IsString } from 'class-validator';

export class GetBusinessInformationDto {
  @IsString()
  registrationNumber!: string;

  @IsString()
  countryCode!: string;

  @IsString()
  @IsOptional()
  @IsNullable()
  state!: string | null;

  @IsString()
  @IsOptional()
  vendor!: string;
}
