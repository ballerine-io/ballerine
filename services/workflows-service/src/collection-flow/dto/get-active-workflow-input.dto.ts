import { IsString } from 'class-validator';

export class GetActiveFlowDto {
  @IsString()
  endUserId!: string;

  @IsString()
  flowType!: string;
}
