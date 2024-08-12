import { findDefinitionByName } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { UIElementDefinition } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useElementDefinition = (
  elementName: string,
  elements: UIElementDefinition<AnyObject>[],
) => {
  const definition = useMemo(() => {
    const definition = findDefinitionByName(elementName, elements);

    if (!definition) throw new Error('definition not found');

    return definition;
  }, [elements, elementName]);

  return definition;
};
