import { IsString } from 'class-validator';

export class GetFlowConfigurationInputDto {
  @IsString()
  language!: string;
}
