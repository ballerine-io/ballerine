import { JSONFormElementBaseParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@/domains/collection-flow';
import { createContext } from 'react';

export interface JSONFormDefinitionContext {
  definition: UIElement<JSONFormElementBaseParams>;
}

export const jsonFormDefinitionContext = createContext<JSONFormDefinitionContext>(
  {} as JSONFormDefinitionContext,
);
