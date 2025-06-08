import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CollectionFlowFileModel {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Unique identifier for this file record',
  })
  @Type(() => String)
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Reference to the actual file ID in storage',
  })
  @Type(() => String)
  @IsString()
  fileId!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Document ID',
  })
  @Type(() => String)
  @IsString()
  documentId!: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'File name',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name!: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'File type',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  mimeType!: string | null;

  @ApiProperty({
    required: true,
    type: String,
    description: 'File URI',
  })
  @Type(() => String)
  @IsString()
  uri!: string;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'File created at',
  })
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;
}
