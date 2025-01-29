import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields/FieldList/providers/StackProvider';
import { IFormElement } from '../../../types';
import { useElementId } from '../../external';

export const usePriorityFields = (element: IFormElement<string, any>) => {
  const { priorityFields, priorityFieldsParams = { behavior: 'disableOthers' } } = useDynamicForm();

  const { stack } = useStack();
  const elementId = useElementId(element, stack);

  const priorityField = useMemo(
    () => priorityFields?.find(field => field.id === elementId),
    [priorityFields, elementId],
  );

  const isPriorityField = useMemo(() => {
    return Boolean(priorityField);
  }, [priorityField]);

  const isShouldDisablePriorityField = useMemo(() => {
    if (!priorityFields?.length) return false;

    return priorityFieldsParams?.behavior === 'disableOthers' && !isPriorityField;
  }, [priorityFieldsParams, isPriorityField, priorityFields?.length]);

  const isShouldHidePriorityField = useMemo(() => {
    if (!priorityFields?.length) return false;

    return priorityFieldsParams?.behavior === 'hideOthers' && !isPriorityField;
  }, [priorityFieldsParams, isPriorityField, priorityFields?.length]);

  return {
    priorityField,
    isPriorityField,
    isShouldDisablePriorityField,
    isShouldHidePriorityField,
  };
};
