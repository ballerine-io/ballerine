import { IsOptional, IsString } from 'class-validator';

export class BusinessInformation {
  @IsString()
  registrationNumber!: string;

  @IsString()
  jurisdictionCode!: string;

  @IsString()
  @IsOptional()
  vendor!: string;
}
