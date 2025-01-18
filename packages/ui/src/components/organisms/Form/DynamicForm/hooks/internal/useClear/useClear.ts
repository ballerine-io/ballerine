import { useMemo } from 'react';
import { useStack } from '../../../fields';
import { IFormElement } from '../../../types';
import { useField } from '../../external';
import {
  DOCUMENT_FIELD_VALUE_CLEANER,
  documentFieldValueCleaner,
} from './value-cleaners/documentfield-value-cleaner';

const CLEANERS = {
  [DOCUMENT_FIELD_VALUE_CLEANER]: documentFieldValueCleaner,
};

export const useClear = (element: IFormElement<any, any>) => {
  const { stack } = useStack();
  const { onChange } = useField(element, stack);

  const clean = useMemo(() => {
    const cleaner = CLEANERS[element.element as keyof typeof CLEANERS];

    if (!cleaner) return () => onChange(undefined, true);

    return (value: any) => onChange(cleaner(value, element), true);
  }, [element, onChange]);

  return clean;
};
