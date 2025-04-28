import { IsObject, IsOptional, IsString } from 'class-validator';

export class FinishFlowDto {
  @IsString()
  eventName!: string;

  @IsObject()
  @IsOptional()
  context!: Record<string, unknown>;
}
