import { ApiProperty } from '@nestjs/swagger';
import { EntityType, Noteable } from '@prisma/client';
import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({
    required: true,
    enum: ['Business', 'EndUser'],
  })
  @IsString()
  entityType!: EntityType;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
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
  @MinLength(1)
  content!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  parentNoteId?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  fileIds?: string;
}
