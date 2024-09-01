import { parse } from 'csv-parse';
import { z, ZodSchema } from 'zod';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import fs from 'fs';

export const parseCsv = async <TSchema extends ZodSchema>(
  processEntity: {
    schema: TSchema;
    logger: AppLoggerService;
    ignoreEmptyProperties?: boolean;
  } & ({ file: Express.Multer.File } | { filePath: string }),
): Promise<Array<z.output<TSchema>>> => {
  const { schema, logger, ignoreEmptyProperties = true } = processEntity;
  let fileContent: Buffer;

  if ('file' in processEntity) {
    fileContent = processEntity.file.buffer;
  } else {
    fileContent = fs.readFileSync(processEntity.filePath);
  }

  return new Promise((resolve, reject) => {
    const results: z.output<TSchema> = [];

    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        skip_records_with_empty_values: true,
        skip_records_with_error: true,
        cast: value => {
          if (value === '' && ignoreEmptyProperties) {
            return undefined;
          }

          return value;
        },
      },
      (err, records) => {
        if (err) {
          reject(err);
        }

        for (const record of records) {
          try {
            const validatedRecord = schema.parse(record);
            results.push(validatedRecord);
          } catch (error) {
            logger.error('Validation error:', { error });
          }
        }

        resolve(results);
      },
    );
  });
};
