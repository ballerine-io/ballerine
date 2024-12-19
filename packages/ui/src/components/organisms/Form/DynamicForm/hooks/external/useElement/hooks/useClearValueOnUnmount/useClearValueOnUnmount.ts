import { useStack } from '@/components/organisms/Form/DynamicForm/fields/FieldList/providers/StackProvider';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { useRef } from 'react';
import { useUnmount } from '../../../../internal/useUnmount';
import { useField } from '../../../useField';

export const useClearValueOnUnmount = (element: IFormElement<any, any>, hidden: boolean) => {
  const { stack } = useStack();
  const { onChange } = useField(element, stack);
  const prevHidden = useRef(hidden);

  useUnmount(() => {
    if (!prevHidden.current && hidden) {
      onChange(undefined, true);
    }
  });
};
