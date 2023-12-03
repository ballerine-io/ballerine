import {
  ICallToActionDocumentOption,
  ICallToActionDocumentSelection,
} from '@/pages/Entity/components/CallToAction/interfaces';
import { useCallback } from 'react';

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
