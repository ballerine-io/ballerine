import { UIElement } from '@/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';
import { jsonFormDefinitionContext } from './json-form-definition.context';
import { JSONFormElementBaseParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';

const { Provider } = jsonFormDefinitionContext;

interface Props {
  children: AnyChildren;
  definition: UIElement<JSONFormElementBaseParams>;
}

export const JSONFormDefinitionProvider = ({ children, definition }: Props) => {
  const ctx = useMemo(() => ({ definition }), [definition]);

  return <Provider value={ctx}>{children}</Provider>;
};
