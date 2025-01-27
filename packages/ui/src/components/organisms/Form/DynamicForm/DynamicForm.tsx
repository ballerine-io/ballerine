import { forwardRef, useImperativeHandle, useMemo } from 'react';

import { Renderer, TRendererSchema } from '../../Renderer';
import { ValidatorProvider } from '../Validator';
import { DynamicFormContext, IDynamicFormContext } from './context';
import { defaultValidationParams } from './defaults';
import { useSubmit } from './hooks/external/useSubmit';
import { useFieldHelpers } from './hooks/internal/useFieldHelpers';
import { useTouched } from './hooks/internal/useTouched';
import { useValidationSchema } from './hooks/internal/useValidationSchema';
import { useValues } from './hooks/internal/useValues';
import { EventsProvider } from './providers/EventsProvider';
import { TaskRunner } from './providers/TaskRunner';
import { extendFieldsRepository, getFieldsRepository } from './repositories';
import { IDynamicFormProps, IFormRef } from './types';

export const DynamicFormV2 = forwardRef(
  <TValues extends object>(
    {
      elements,
      values: initialValues,
      validationParams = defaultValidationParams,
      priorityFields,
      priorityFieldsParams,
      fieldExtends,
      metadata,
      onChange,
      onFieldChange,
      onSubmit,
      onEvent,
    }: IDynamicFormProps<TValues>,
    ref: React.Ref<IFormRef<TValues>>,
  ) => {
    const validationSchema = useValidationSchema(elements);
    const valuesApi = useValues<TValues>({
      values: initialValues,
      onChange,
      onFieldChange,
    });
    const touchedApi = useTouched(elements, valuesApi.values);
    const fieldHelpers = useFieldHelpers<TValues>({ valuesApi, touchedApi });
    const { submit } = useSubmit({ values: valuesApi.values, onSubmit });

    useImperativeHandle(ref, () => ({
      submit,
      validate: () => null,
      setValues: valuesApi.setValues,
      setTouched: touchedApi.setTouched,
      setFieldValue: (fieldName: string, value: unknown) => {
        fieldHelpers.setValue(fieldName, fieldName, value);
      },
      setFieldTouched: fieldHelpers.setTouched,
    }));

    const context: IDynamicFormContext<TValues> = useMemo(
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
        validationParams: validationParams ?? {},
        priorityFields,
        priorityFieldsParams,
      }),
      [
        touchedApi.touched,
        valuesApi.values,
        submit,
        fieldHelpers,
        fieldExtends,
        onEvent,
        metadata,
        validationParams,
        priorityFields,
        priorityFieldsParams,
      ],
    );

    return (
      <TaskRunner>
        <EventsProvider onEvent={onEvent}>
          <DynamicFormContext.Provider value={context}>
            <ValidatorProvider
              schema={validationSchema}
              value={context.values}
              {...validationParams}
            >
              <Renderer
                elements={elements}
                schema={context.elementsMap as unknown as TRendererSchema}
              />
            </ValidatorProvider>
          </DynamicFormContext.Provider>
        </EventsProvider>
      </TaskRunner>
    );
  },
);

DynamicFormV2.displayName = 'DynamicFormV2';
