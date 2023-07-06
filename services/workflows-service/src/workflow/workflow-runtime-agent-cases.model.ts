import { ApiProperty } from '@nestjs/swagger';

export class WorkflowRuntimeAgentCasesModel {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  casesCount!: number;
}
