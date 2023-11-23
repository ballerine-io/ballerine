import { useContext, useMemo } from 'react';
import get from 'lodash/get';
import { warningsContext } from '@/components/organisms/DynamicForm/warnings.context';
import { convertFieldIdToObjectPath } from '@/components/organisms/DynamicForm/hooks/useWarnings/utils/convertFieldIdToObjectPath';

export const useWarnings = (fieldId: string) => {
  const { warnings } = useContext(warningsContext);

  const fieldWarnings = useMemo(
    () => get(warnings, convertFieldIdToObjectPath(fieldId), null),
    [fieldId, warnings],
  );

  return {
    fieldWarnings,
  };
};
