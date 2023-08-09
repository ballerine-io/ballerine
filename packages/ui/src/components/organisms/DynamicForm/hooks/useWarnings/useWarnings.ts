import { useContext, useMemo } from 'react';
import get from 'lodash/get';
import { warningsContext } from '@components/organisms/DynamicForm/warnings.context';
import { convertFieldIdToObjectPath } from '@components/organisms/DynamicForm/hooks/useWarnings/utils/convertFieldIdToObjectPath';
import { InputWarning } from '@components/organisms/DynamicForm/DynamicForm';

export const useWarnings = (fieldId: string) => {
  const { warnings } = useContext(warningsContext);

  const fieldWarnings = useMemo(
    () => get(warnings, convertFieldIdToObjectPath(fieldId), null) as InputWarning | null,
    [fieldId, warnings],
  );

  return {
    fieldWarnings,
  };
};
