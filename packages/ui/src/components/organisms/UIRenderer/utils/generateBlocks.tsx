import { ElementsMap } from '../types/elements.types';
import { UISchema } from '../types/ui-schema.types';
import { createBlocks } from '@ballerine/blocks';

export const generateBlocks = (schema: UISchema | UISchema[], elements: ElementsMap) => {
  let base = createBlocks<keyof typeof elements>().addBlock();

  if (Array.isArray(schema)) {
    schema.forEach(schema => {
      base = base.addCell({
        type: schema.type,
        childrens: schema.elements
          ? schema.elements.map(schema => generateBlocks(schema).flat(1))
          : [],
        options: schema.options,
      });
    });
  } else {
    base = base.addCell({
      type: schema.type,
      options: schema.options,
      childrens: schema.elements
        ? schema.elements.map(schema => generateBlocks(schema).flat(1))
        : [],
    });
  }

  return base.build();
};
