import { parse } from 'csv-parse';
import { z, ZodSchema } from 'zod';
import { AppLoggerService } from "@/common/app-logger/app-logger.service";

export const parseCsv = async <TSchema extends ZodSchema>(
  file: Express.Multer.File,
  schema: TSchema,
  logger: AppLoggerService
): Promise<Array<z.output<TSchema>>> =>
  new Promise((resolve, reject) => {
    const results: z.output<TSchema> = [];

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
    });

    parser.on('readable', () => {
      let record;

      while ((record = parser.read()) !== null) {
        try {
          const validatedRecord = schema.parse(record);

          results.push(validatedRecord);
        } catch (error) {
          logger.error('Validation error:', {error});
        }
      }
    });

    parser.on('error', err => {
      reject(err);
    });

    parser.on('end', () => {
      resolve(results);
    });

    parser.write(file.buffer);
    parser.end();
  });
