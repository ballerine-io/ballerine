import { DynamicFormV2, IFormElement } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { formElementsExtends } from './ui-elemenets.extends';

interface ICollectionFlowUIProps {
  elements: Array<IFormElement<any, any>>;
  context: object;
}

export const CollectionFlowUI: FunctionComponent<ICollectionFlowUIProps> = ({
  elements,
  context,
}) => {
  return <DynamicFormV2 fieldExtends={formElementsExtends} elements={elements} values={context} />;
};
