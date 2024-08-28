import { parse } from 'csv-parse';
import { z, ZodSchema } from 'zod';

export const parseCsv = async <TSchema extends ZodSchema>(
  file: Express.Multer.File,
  schema: TSchema,
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
          console.error('Validation error:', error);
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
