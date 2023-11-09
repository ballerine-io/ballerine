import { JSONFormElementParams } from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';
import { jsonFormDefinitionContext } from './json-form-definition.context';

const { Provider } = jsonFormDefinitionContext;

interface Props {
  children: AnyChildren;
  definition: UIElement<JSONFormElementParams>;
}

export const JSONFormDefinitionProvider = ({ children, definition }: Props) => {
  const ctx = useMemo(() => ({ definition }), [definition]);

  return <Provider value={ctx}>{children}</Provider>;
};
