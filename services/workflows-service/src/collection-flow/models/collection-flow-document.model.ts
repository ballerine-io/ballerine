import { ApiProperty } from '@nestjs/swagger';
import { DocumentDecision, DocumentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CollectionFlowFileModel } from './collection-flow-file.model';

export class CollectionFlowDocumentModel {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Document ID',
  })
  @Type(() => String)
  @IsString()
  id!: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Business ID',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  businessId!: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'End user ID',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  endUserId!: string | null;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Document category',
  })
  @Type(() => String)
  @IsString()
  category!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Document type',
  })
  @Type(() => String)
  @IsString()
  type!: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Document version',
  })
  @Type(() => Number)
  @IsNumber()
  version!: number;

  @ApiProperty({
    required: false,
    enum: DocumentDecision,
    description: 'Document decision',
  })
  @Type(() => String)
  @IsEnum(DocumentDecision)
  @IsOptional()
  decision!: DocumentDecision | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Document status',
  })
  @Type(() => String)
  @IsString()
  status!: DocumentStatus | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Analyst decision reason',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  decisionReason!: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Analyst comment',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  comment!: string | null;

  @ApiProperty({
    required: true,
    type: [CollectionFlowFileModel],
    description: 'Document files',
  })
  @Type(() => CollectionFlowFileModel)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  files!: CollectionFlowFileModel[] | null;
}
