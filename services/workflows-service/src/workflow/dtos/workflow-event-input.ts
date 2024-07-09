import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from '@sinclair/typebox';

export class WorkflowEventInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: false,
    type: Object,
  })
  @IsObject()
  @IsOptional()
  payload?: Record<PropertyKey, unknown>;
}

export const WorkflowEventInputSchema = Type.Object({
  name: Type.String({
    description: 'The event to send',
  }),
  payload: Type.Optional(
    Type.Record(Type.String(), Type.Unknown(), {
      description: 'Optional data to send with the event',
    }),
  ),
});
