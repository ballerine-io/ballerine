import { IsOptional, IsString } from 'class-validator';

export class BusinessInformation {
  @IsString()
  jurisdictionCode!: string;

  @IsString()
  @IsOptional()
  vendor!: string;
}
