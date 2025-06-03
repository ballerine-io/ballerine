import { CastingContext, parse } from 'csv-parse';
import { z, ZodSchema } from 'zod';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ForbiddenException } from '@/errors';
import fs from 'fs';

export const parseCsv = async <TSchema extends ZodSchema>(
  processEntity: {
    schema: TSchema;
    logger: AppLoggerService;
    ignoreEmptyProperties?: boolean;
    cast?: (value: string, context: CastingContext) => string | undefined;
  } & ({ file: Express.Multer.File } | { filePath: string }),
): Promise<Array<z.output<TSchema>>> => {
  const { schema, logger, ignoreEmptyProperties = true, cast } = processEntity;
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
        cast: (value, context) => {
          if (value === '' && ignoreEmptyProperties) {
            return undefined;
          }

          return cast?.(value, context) ?? value;
        },
      },
      (err, records) => {
        if (err) {
          reject(err);
        }

        let hadErrors = false;

        for (const record of records) {
          try {
            const validatedRecord = schema.parse(record);
            results.push(validatedRecord);
          } catch (error) {
            logger.error('Validation error:', { error, record });
            hadErrors = true;
          }
        }

        if (hadErrors) {
          reject(new ForbiddenException('Schema errors in CSV'));
        } else {
          resolve(results);
        }
      },
    );
  });
};
