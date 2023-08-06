import { IsOptional, IsString } from 'class-validator';

export class GetCompanyInfoDto {
  @IsString()
  jurisdictionCode!: string;

  @IsString()
  @IsOptional()
  vendor!: string;
}
