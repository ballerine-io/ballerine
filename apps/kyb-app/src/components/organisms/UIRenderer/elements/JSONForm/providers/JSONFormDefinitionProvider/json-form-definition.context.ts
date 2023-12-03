import { JSONFormElementParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@/domains/collection-flow';
import { createContext } from 'react';

export interface JSONFormDefinitionContext {
  definition: UIElement<JSONFormElementParams>;
}

export const jsonFormDefinitionContext = createContext<JSONFormDefinitionContext>(
  {} as JSONFormDefinitionContext,
);
