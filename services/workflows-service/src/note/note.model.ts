import { ApiProperty } from '@nestjs/swagger';
import { EntityType, Noteable } from '@prisma/client';
import { IsString } from 'class-validator';

export class NoteModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  entityId!: string;

  @ApiProperty({
    required: true,
    enum: ['Business', 'EndUser'],
  })
  @IsString()
  entityType!: EntityType;

  @ApiProperty({
    type: String,
  })
  @IsString()
  noteableId!: string;

  @ApiProperty({
    required: true,
    enum: ['Workflow', 'Report', 'Alert'],
  })
  @IsString()
  noteableType!: Noteable;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  content!: string;

  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsString()
  parentNote!: NoteModel | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  fileIds?: string;
}
