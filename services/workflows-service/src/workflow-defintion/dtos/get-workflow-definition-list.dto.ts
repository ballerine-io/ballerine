import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetWorkflowDefinitionListDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit!: number;
}
