import { DocumentFileType, DocumentFileVariant } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  category!: string;

  @IsString()
  type!: string;

  @IsString()
  issuingVersion!: string;

  @IsString()
  issuingCountry!: string;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @Min(1)
  page!: number;

  @IsEnum(DocumentFileType)
  documentType!: DocumentFileType;

  @IsEnum(DocumentFileVariant)
  documentVariant!: DocumentFileVariant;

  @IsString()
  @IsOptional()
  businessId!: string;

  @IsString()
  @IsOptional()
  endUserId!: string;
}

export const CreateDocumentSchema = Type.Object({
  category: Type.String(),
  type: Type.String(),
  issuingVersion: Type.String(),
  issuingCountry: Type.String(),
  page: Type.Number({ minimum: 1 }),
  documentType: Type.Enum(DocumentFileType),
  documentVariant: Type.Enum(DocumentFileVariant),
  businessId: Type.Optional(Type.String()),
  endUserId: Type.Optional(Type.String()),
  file: Type.Object({
    fieldname: Type.String(),
    originalname: Type.String(),
    encoding: Type.String(),
    mimetype: Type.String(),
    size: Type.Number(),
    destination: Type.String(),
    filename: Type.String(),
    path: Type.String(),
    buffer: Type.Optional(Type.Any()),
  }),
});
