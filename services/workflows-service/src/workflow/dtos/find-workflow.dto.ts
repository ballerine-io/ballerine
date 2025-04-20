import { ApiProperty } from '@nestjs/swagger';

export class FindWorkflowParamsDto {
  @ApiProperty()
  id!: string;
}
