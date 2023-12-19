import { useCallback } from 'react';
import {
  ICallToActionDocumentOption,
  ICallToActionDocumentSelection,
} from '@/lib/blocks/components/DirectorsCallToAction/interfaces';

export const useDocumentSelection = (
  params?: ICallToActionDocumentSelection,
  onChangeCallback?: () => void,
) => {
  const { options = [], value, onSelect } = params || {};

  const handleDocumentSelect = useCallback(
    (value: ICallToActionDocumentOption['value']) => {
      onSelect && onSelect(value);
      onChangeCallback && onChangeCallback();
    },
    [onSelect, onChangeCallback],
  );

  return {
    options,
    value,
    onSelect: handleDocumentSelect,
  };
};
