import z from 'zod';
import { TUIElement, UIElementsSchemaWithChildren } from './elements';

export interface IUIDefinitionItem {
  elements: TUIElement[];
}

const getValueAtPath = (obj: any, path: string) => {
  const pathParts = path.split('.').map(part => {
    // Convert numeric strings to numbers for array indices
    return /^\d+$/.test(part) ? Number(part) : part;
  });

  let value = obj;
  for (const key of pathParts) {
    if (value === undefined || value === null) return undefined;
    value = value[key];
  }
  return value;
};

export const assertUIDefinitionValid = (definition: IUIDefinitionItem[]) => {
  try {
    const result = z
      .array(
        z.object({
          elements: z.array(UIElementsSchemaWithChildren),
        }),
      )
      .parse(definition);

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\x1b[31mUI Definition Validation Errors:\x1b[0m');
      (error as z.ZodError).errors.forEach(err => {
        console.error(`\x1b[31mMessage: ${err.message}\x1b[0m`);
        console.log(
          '\x1b[31mInvalid value:\x1b[0m',
          '\x1b[32m' + getValueAtPath(definition, err.path.join('.')) + '\x1b[0m',
        );
        console.error(`\x1b[31mAt path: ${err.path.join('.')}\x1b[0m`);

        if (err.code === 'invalid_union_discriminator') {
          console.error('\x1b[31mAllowed element types:\x1b[0m');
          err.options?.forEach(option => console.error(`\x1b[31m- ${String(option)}\x1b[0m`));
        }
      });
    }

    throw new Error(`Validation failed: ${(error as z.ZodError).message}`);
  }
};
