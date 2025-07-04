import { useEffect, useMemo, useRef } from 'react';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields';
import { useField } from '../../external';
import {
  DOCUMENT_FIELD_VALUE_CLEANER,
  documentFieldValueCleaner,
} from './value-cleaners/documentfield-value-cleaner';
import { IHttpParams } from '@/common/hooks/useHttp';
import { TUIElement } from '@ballerine/common';

const CLEANERS = {
  [DOCUMENT_FIELD_VALUE_CLEANER]: documentFieldValueCleaner,
};

export const useClear = (element: TUIElement) => {
  const { stack } = useStack();
  const { onChange } = useField(element, stack);
  const { metadata, httpParams } = useDynamicForm();

  const metadataRef = useRef(metadata);

  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);

  const clean = useMemo(() => {
    const cleaner = CLEANERS[element.element as keyof typeof CLEANERS];

    if (!cleaner) {
      return () => onChange(undefined, true);
    }

    return async (value: any) =>
      onChange(
        await cleaner(value, element, (httpParams || {}) as IHttpParams, metadataRef.current),
        true,
      );
  }, [element, httpParams, metadataRef, onChange]);

  return clean;
};
