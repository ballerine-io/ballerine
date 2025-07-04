import DOMPurify from 'dompurify';
import { FunctionComponent } from 'react';
import { TUIElement } from '@ballerine/common';

interface IFieldDescriptionProps {
  element: TUIElement;
}

export const FieldDescription: FunctionComponent<IFieldDescriptionProps> = ({ element }) => {
  const { description } = (element.params as { description?: string } | undefined) || {};

  if (!description) return null;

  return (
    <p
      className="mt-2 text-sm text-gray-400"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
    />
  );
};
