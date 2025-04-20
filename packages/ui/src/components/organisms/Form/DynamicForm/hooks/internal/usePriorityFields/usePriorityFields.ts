import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields/FieldList/providers/StackProvider';
import { IFormElement } from '../../../types';
import { useElementId } from '../../external';
import { isExactIdMatch } from '../../../helpers/is-exact-id-match/is-exact-id-match';
import { isMatchAsWildcard } from '../../../helpers/is-match-as-wildcard/is-match-as-wildcard';

export const usePriorityFields = (element: IFormElement<string, any>) => {
  const { priorityFields, priorityFieldsParams = { behavior: 'disableOthers' } } = useDynamicForm();

  const { stack } = useStack();
  const elementId = useElementId(element, stack);
  const originElementId = element.id;

  const priorityField = useMemo(
    () =>
      priorityFields?.find(
        priorityField =>
          isExactIdMatch(elementId, priorityField.id) ||
          isMatchAsWildcard(originElementId, priorityField.id),
      ),
    [priorityFields, elementId, originElementId],
  );

  const isPriorityField = useMemo(() => {
    return Boolean(priorityField);
  }, [priorityField]);

  const isShouldDisablePriorityField = useMemo(() => {
    if (!priorityFields?.length) {
      return false;
    }

    return priorityFieldsParams?.behavior === 'disableOthers' && !isPriorityField;
  }, [priorityFieldsParams, isPriorityField, priorityFields?.length]);

  const isShouldHidePriorityField = useMemo(() => {
    if (!priorityFields?.length) {
      return false;
    }

    return priorityFieldsParams?.behavior === 'hideOthers' && !isPriorityField;
  }, [priorityFieldsParams, isPriorityField, priorityFields?.length]);

  return {
    priorityField,
    isPriorityField,
    isShouldDisablePriorityField,
    isShouldHidePriorityField,
  };
};
