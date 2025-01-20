import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { useRef } from 'react';
import { useStack } from '../../../../../fields';
import { useClear } from '../../../../internal/useClear';
import { useUnmount } from '../../../../internal/useUnmount';
import { useField } from '../../../useField';

export const useClearValueOnUnmount = (element: IFormElement<any, any>, hidden: boolean) => {
  const clean = useClear(element);
  const prevHidden = useRef(hidden);
  const { stack } = useStack();
  const { value } = useField(element, stack);

  useUnmount(() => {
    if (!prevHidden.current && hidden) {
      clean(value);
      console.log('clean', value);
    }
  });
};
