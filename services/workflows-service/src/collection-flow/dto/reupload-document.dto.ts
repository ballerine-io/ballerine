import { DocumentFileType, DocumentFileVariant } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class ReuploadDocumentDto {
  @IsEnum(DocumentFileType)
  documentType!: DocumentFileType;

  @IsEnum(DocumentFileVariant)
  documentVariant!: DocumentFileVariant;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @Min(1)
  page!: number;
}
