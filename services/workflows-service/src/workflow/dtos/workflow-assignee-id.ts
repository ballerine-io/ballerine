import { IsString, ValidateIf } from 'class-validator';

export class WorkflowAssigneeId {
  @IsString()
  @ValidateIf((object, value) => value !== null) // no nullable class validator - skip validation if null
  assigneeId!: string | null;
}
