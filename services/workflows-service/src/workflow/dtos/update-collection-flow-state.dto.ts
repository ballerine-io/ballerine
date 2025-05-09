import { CollectionFlowStatusesEnum, CollectionFlowStepStatesEnum } from '@ballerine/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

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
    enum: CollectionFlowStepStatesEnum,
    enumName: 'CollectionFlowStepStatesEnum',
    description: 'Current state of the step',
  })
  @IsString()
  @IsEnum(CollectionFlowStepStatesEnum)
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
    enum: CollectionFlowStatusesEnum,
    enumName: 'CollectionFlowStatusesEnum',
    description: 'The status of the collection flow',
  })
  @IsString()
  @IsEnum(CollectionFlowStatusesEnum)
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
