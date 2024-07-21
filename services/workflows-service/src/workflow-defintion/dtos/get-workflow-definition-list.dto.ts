import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetWorkflowDefinitionListDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit!: number;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  public?: boolean;
}
