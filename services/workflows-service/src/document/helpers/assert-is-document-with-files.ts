import { DocumentFile, File, Document } from '@prisma/client';

import { LoggerInterface, isType } from '@ballerine/common';

import { InternalServerErrorException } from '@nestjs/common';
import * as z from 'zod';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- assert functions are expected to be function expressions
export function assertIsDocumentWithFiles(
  documents: Document[],
  logger: LoggerInterface,
): asserts documents is Array<Document & { files: Array<DocumentFile & { file: File }> }> {
  const DocumentsWithFilesSchema = z.array(
    z.object({
      files: z.array(
        z.object({
          file: z.record(z.union([z.string(), z.number(), z.symbol()]), z.unknown()),
        }),
      ),
    }),
  );

  if (isType(DocumentsWithFilesSchema)(documents)) {
    return;
  }

  logger.error('Documents do not have files. Did you forget to specify `include` or `select`?');

  throw new InternalServerErrorException();
}
