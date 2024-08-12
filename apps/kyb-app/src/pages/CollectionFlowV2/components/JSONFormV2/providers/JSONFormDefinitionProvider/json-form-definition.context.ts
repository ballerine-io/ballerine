import { JSONFormElementBaseParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElementDefinition } from '@/domains/collection-flow';
import { createContext } from 'react';

export interface JSONFormDefinitionContext {
  definition: UIElementDefinition<JSONFormElementBaseParams>;
}

export const jsonFormDefinitionContext = createContext<JSONFormDefinitionContext>(
  {} as JSONFormDefinitionContext,
);
