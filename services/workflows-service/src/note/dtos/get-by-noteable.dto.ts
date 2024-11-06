import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Noteable } from '@prisma/client';

export class GetByNoteableDto {
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
}
