import { IsString } from 'class-validator';

export class GetActiveFlowDto {
  @IsString()
  email!: string;

  @IsString()
  workflowRuntimeDefinitionId!: string;
}
