import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmitSystemBodyInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  systemEventName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  projectId!: string;
}

export class EmitSystemParamInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;
}
