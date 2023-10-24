import { IsString } from 'class-validator';

export class FinishFlowDto {
  @IsString()
  eventName!: string;
}
