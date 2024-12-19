import { FunctionComponent, useMemo } from 'react';

import { Renderer, TRendererSchema } from '../../Renderer';
import { ValidatorProvider } from '../Validator';
import { DynamicFormContext, IDynamicFormContext } from './context';
import { useSubmit } from './hooks/external/useSubmit';
import { useFieldHelpers } from './hooks/internal/useFieldHelpers';
import { useTouched } from './hooks/internal/useTouched';
import { useValidationSchema } from './hooks/internal/useValidationSchema';
import { useValues } from './hooks/internal/useValues';
import { TaskRunner } from './providers/TaskRunner';
import { extendFieldsRepository, getFieldsRepository } from './repositories';
import { IDynamicFormProps } from './types';

export const DynamicFormV2: FunctionComponent<IDynamicFormProps> = ({
  elements,
  values: initialValues,
  validationParams,
  fieldExtends,
  metadata,
  onChange,
  onFieldChange,
  onSubmit,
  onEvent,
}) => {
  const validationSchema = useValidationSchema(elements);
  const valuesApi = useValues({
    values: initialValues,
    onChange,
    onFieldChange,
  });
  const touchedApi = useTouched(elements, valuesApi.values);
  const fieldHelpers = useFieldHelpers({ valuesApi, touchedApi });
  const { submit } = useSubmit({ values: valuesApi.values, onSubmit });

  const context: IDynamicFormContext<typeof valuesApi.values> = useMemo(
    () => ({
      touched: touchedApi.touched,
      values: valuesApi.values,
      submit,
      fieldHelpers,
      elementsMap: fieldExtends ? extendFieldsRepository(fieldExtends) : getFieldsRepository(),
      callbacks: {
        onEvent,
      },
      metadata: metadata ?? {},
    }),
    [touchedApi.touched, valuesApi.values, submit, fieldHelpers, fieldExtends, onEvent, metadata],
  );

  return (
    <TaskRunner>
      <DynamicFormContext.Provider value={context}>
        <ValidatorProvider schema={validationSchema} value={context.values} {...validationParams}>
          <Renderer
            elements={elements}
            schema={context.elementsMap as unknown as TRendererSchema}
          />
        </ValidatorProvider>
      </DynamicFormContext.Provider>
    </TaskRunner>
  );
};
