import { useRefValue } from '@/hooks/useRefValue';
import { TDocument } from '@ballerine/common';
import {
  FileField,
  IFormElement,
  IFormEventElement,
  TBaseFields,
  TDynamicFormField,
  TElementEvent,
  useDynamicForm,
  useEventsConsumer,
} from '@ballerine/ui';
import get from 'lodash/get';
import { useCallback, useMemo } from 'react';
import { buildPathToDocumentFileId, formatFileFieldElement, getDocumentIndex } from './helpers';
import { useListener } from './hooks/useListener';
import { IDocumentTemplate } from './types';
// Main logic behind this component is to merge the document with the template when the document is changed
// After File input is changed, we need to merge the document with the template
// This is done by using the useListener hook to listen to the onChange event
// When the onChange event is triggered, we merge the document with the template
// If the document is being removed by the input, we remove the document from the array
// If the document is being selected by the input, we merge the document with the template

// TODO: Tests
export const DOCUMENT_FIELD_TYPE = 'documentfield';

export interface IDocumentFieldParams {
  documentTemplate: IDocumentTemplate;
  page?: number;
  pageProperty?: string;
}

export const isDocumentFieldDefinition = (
  element: IFormElement<any, any>,
): element is IFormElement<TBaseFields | typeof DOCUMENT_FIELD_TYPE, IDocumentFieldParams> => {
  return element.element === DOCUMENT_FIELD_TYPE;
};

export const DocumentField: TDynamicFormField<IDocumentFieldParams> = ({ element }) => {
  const { documentTemplate, page = 0, pageProperty = 'ballerineFileId' } = element.params || {};

  if (!documentTemplate) {
    console.error('Document template is required');
    throw new Error('Document template is required');
  }

  const { values, fieldHelpers } = useDynamicForm();
  const { setValue } = fieldHelpers;

  const documentIndex = useMemo(() => {
    return getDocumentIndex(element.valueDestination, values, documentTemplate.id);
  }, [element.valueDestination, values, documentTemplate.id]);

  const formattedElement = useMemo(() => {
    return formatFileFieldElement(element, {
      path: buildPathToDocumentFileId({
        rootPath: element.valueDestination,
        documentIndex,
        page,
        pageProperty,
      }),
    });
  }, [element, documentIndex, page, pageProperty]);

  const valuesRef = useRefValue(values);

  const mergeDocumentWithTemplate = useCallback(
    (_: TElementEvent, eventElement: IFormEventElement<any, any>) => {
      const documents: TDocument[] = get(valuesRef.current, element.valueDestination, []);

      // Document is being removed by input
      if (get(valuesRef.current, eventElement.valueDestination) === undefined) {
        const filteredDocuments = documents.filter(document => document.id !== documentTemplate.id);

        setValue(element.id, element.valueDestination, filteredDocuments);
      }
      // Document selection
      else {
        if (!documents.length) return;

        const latestDocument = documents[documents.length - 1];

        if (!latestDocument) return;

        const mergedDocument = {
          ...((latestDocument as unknown as object) || {}),
          ...documentTemplate,
          decision: {},
        } as unknown as TDocument;

        documents[documents.length - 1] = mergedDocument;

        setValue(element.id, element.valueDestination, documents);
      }
    },
    [valuesRef, documentTemplate, element, setValue],
  );

  useEventsConsumer(useListener(element as IFormEventElement<any, any>, mergeDocumentWithTemplate));

  return <FileField element={formattedElement} />;
};
