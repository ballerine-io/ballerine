import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class CollectionFlowStep {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Name of the step',
  })
  @IsString()
  stepName!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Current state of the step',
  })
  @IsString()
  state!: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Reason for the current state',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateCollectionFlowStateDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'The current step in the collection flow',
  })
  @IsString()
  currentStep!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The status of the collection flow',
  })
  @IsString()
  status!: string;

  @ApiProperty({
    required: true,
    type: [CollectionFlowStep],
    description: 'Array of steps in the collection flow',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollectionFlowStep)
  steps!: CollectionFlowStep[];
}
