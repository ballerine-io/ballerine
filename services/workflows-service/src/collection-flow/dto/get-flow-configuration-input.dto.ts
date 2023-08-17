import { IsNotEmpty, IsString } from 'class-validator';

export class GetFlowConfigurationDto {
  @IsString()
  @IsNotEmpty()
  flowType!: string;
}
