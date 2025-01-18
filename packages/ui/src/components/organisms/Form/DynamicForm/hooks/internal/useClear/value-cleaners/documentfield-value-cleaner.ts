import { DOCUMENT_FIELD_TYPE, IDocumentFieldParams } from '../../../../fields';
import { TBaseFields } from '../../../../repositories';
import { IFormElement } from '../../../../types';

export const DOCUMENT_FIELD_VALUE_CLEANER = DOCUMENT_FIELD_TYPE;

export const documentFieldValueCleaner = <TValue extends Array<{ id: string }>>(
  value: TValue,
  element: IFormElement<TBaseFields, IDocumentFieldParams>,
): TValue | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter(({ id }) => id !== element.params?.template?.id) as TValue;
};
