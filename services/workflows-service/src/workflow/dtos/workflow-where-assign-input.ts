import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class WorkflowWhereAssignInput {
  @IsString()
  @ValidateIf((object, value) => value !== null) // no nullable class validator - skip validation if null
  assigneeId!: string | null;
}
