import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { EntityType, Noteable } from '@prisma/client';

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
    enum: EntityType,
  })
  @IsEnum(EntityType)
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
  @IsEnum(Noteable)
  noteableType!: Noteable;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiProperty({
    required: true,
    type: Object,
  })
  parentNote!: NoteModel | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  fileIds?: string;
}
