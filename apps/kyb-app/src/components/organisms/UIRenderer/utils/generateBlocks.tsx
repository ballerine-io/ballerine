//@ts-nocheck
import { UIElementDefinition } from '@/domains/collection-flow';
import { createBlocks } from '@ballerine/blocks';
import { v4 } from 'uuid';
import { ElementsMap } from '../types/elements.types';

export const generateBlocks = (
  schema: UIElementDefinition | UIElementDefinition[],
  elements: ElementsMap,
) => {
  let base = createBlocks<keyof typeof elements>().addBlock();

  if (Array.isArray(schema)) {
    schema.forEach(schema => {
      base = base.addCell({
        id: schema.name || v4(),
        type: schema.type,
        definition: schema,
        childrens: schema.elements
          ? schema.elements.map(schema => generateBlocks(schema).flat(1))
          : [],
        options: schema.options,
        keyProp: schema.name || v4(),
      });
    });
  } else {
    base = base.addCell({
      id: schema.name || v4(),
      type: schema.type,
      options: schema.options,
      definition: schema,
      childrens: schema.elements
        ? schema.elements.map(schema => generateBlocks(schema).flat(1))
        : [],
      keyProp: schema.name || v4(),
    });
  }

  return base.build();
};
