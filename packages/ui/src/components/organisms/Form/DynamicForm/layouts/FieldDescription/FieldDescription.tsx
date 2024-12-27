import { FunctionComponent } from 'react';
import { IFormElement } from '../../types';

interface IFieldDescriptionProps {
  element: IFormElement<string, any>;
}

export const FieldDescription: FunctionComponent<IFieldDescriptionProps> = ({ element }) => {
  const { description } = element.params || {};

  if (!description) return null;

  return <p className="mt-2 text-sm text-gray-400">{description}</p>;
};
