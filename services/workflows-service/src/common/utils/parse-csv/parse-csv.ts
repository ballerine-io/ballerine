import { CastingContext, parse } from 'csv-parse';
import { z, ZodError, ZodSchema } from 'zod';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import fs from 'fs';
import { ValidationError } from '@/errors';

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
  let filenameWithExtension: string;

  if ('file' in processEntity) {
    fileContent = processEntity.file.buffer;
    filenameWithExtension = processEntity.file.originalname;
  } else {
    fileContent = fs.readFileSync(processEntity.filePath);
    filenameWithExtension = processEntity.filePath;
  }
  const isCsv = filenameWithExtension.toLowerCase().endsWith('.csv');

  return new Promise((resolve, reject) => {
    const results: z.output<TSchema> = [];
    const errors: { message: string }[] = [];

    if (!isCsv) {
      errors.push({
        message: `Unsupported file type - please download and use the provided template`,
      });
      reject(new ValidationError(errors));
    }

    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        skip_records_with_empty_values: true,
        cast: (value, context) => {
          if (value === '' && ignoreEmptyProperties) {
            return undefined;
          }

          return cast?.(value, context) ?? value;
        },
      },
      (err, records) => {
        if (err) {
          logger.warn(`Error parsing CSV file: ${err.message}`);
          errors.push({ message: err.message });
        }

        if (records && !records.length) {
          errors.push({ message: 'CSV seems empty. Please add at least one row' });
        }

        records?.forEach((record: unknown, index: number) => {
          try {
            const validatedRecord = schema.parse(record);
            results.push(validatedRecord);
          } catch (error) {
            const lineNumber = index + 2;
            if (!(error instanceof ZodError)) {
              throw error;
            }
            logger.error('Validation error:', { error, record });
            const rowErrors = error.errors.map(zodIssue => ({
              message: `Line ${lineNumber} - ${zodIssue.message}`,
            }));
            errors.push(...rowErrors);
          }
        });

        if (errors.length > 0) {
          reject(new ValidationError(errors));
        } else {
          resolve(results);
        }
      },
    );
  });
};
