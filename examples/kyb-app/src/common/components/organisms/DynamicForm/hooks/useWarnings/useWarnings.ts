import { warningsContext } from '@app/common/components/organisms/DynamicForm/warnings.context';
import { useContext, useMemo } from 'react';
import get from 'lodash/get';
import { convertFieldIdToObjectPath } from '@app/common/components/organisms/DynamicForm/hooks/useWarnings/utils/convertFieldIdToObjectPath';
import { InputWarning } from '@app/common/components/organisms/DynamicForm/DynamicForm';

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
