import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import type { DefaultContextSchema } from '@ballerine/common';

export class WorkflowRunDto {
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'The unique identifier of the workflow to run.',
    example: '5f8d8e8b8c8d8e8b8c8d8e8b',
  })
  workflowId!: string;

  @IsNotEmpty()
  @IsObject()
  @IsOptional()
  @ApiProperty({
    required: true,
    type: 'object',
    description: 'The context data required by the workflow.',
    example: {
      value: {
        workflowId: '5f8d8e8b8c8d8e8b8c8d8e8b',
        context: {
          entity: {
            type: 'business',
            id: '123456',
            data: {},
          },
          documents: [
            {
              category: 'businessRegistration',
              type: 'certificateOfIncorporation',
              issuer: {
                country: 'US',
              },
              pages: [
                {
                  ballerineFileId: 'file123',
                },
              ],
              properties: {},
            },
          ],
        },
      },
    },
  })
  context!: DefaultContextSchema;

  @ApiProperty({
    required: false,
    type: 'object',
    description: 'Additional configuration for the workflow run.',
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceObjectName?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceRecordId?: string;
}
