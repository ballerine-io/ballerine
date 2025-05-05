import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetKybAndOwnershipChecksDto {
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  page: number = 0;

  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  limit: number = 20;
}
