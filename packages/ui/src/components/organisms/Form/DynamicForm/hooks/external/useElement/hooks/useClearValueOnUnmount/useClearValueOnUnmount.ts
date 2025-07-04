import { useEffect, useRef } from 'react';
import { useStack } from '../../../../../fields';
import { useClear } from '../../../../internal/useClear';
import { useField } from '../../../useField';
import { TUIElement } from '@ballerine/common';

export const useClearValueOnUnmount = (element: TUIElement, hidden: boolean) => {
  const clean = useClear(element);
  const { stack } = useStack();
  const { value } = useField(element, stack);
  const valueRef = useRef(value);
  const cleanRef = useRef(clean);
  const prevHiddenRef = useRef<boolean | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    cleanRef.current = clean;
  }, [clean]);

  useEffect(() => {
    if (prevHiddenRef.current === null && hidden) {
      prevHiddenRef.current = hidden;

      return;
    }

    if (prevHiddenRef.current !== hidden) {
      if (hidden) {
        cleanRef.current(valueRef.current);
        console.debug(`Cleaned up ${element.id}`);
      }

      prevHiddenRef.current = hidden;
    }
  }, [hidden, cleanRef, valueRef, prevHiddenRef, element.id]);
};
