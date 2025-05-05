import { oneOf } from '@/common/decorators/one-of.decorator';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetChecksDto {
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  page: number = 0;

  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsNumber()
  @IsOptional()
  limit: number = 20;

  @IsString()
  @oneOf(['kyb_and_ownership'])
  @IsOptional()
  checkType: string = 'kyb_and_ownership';
}
