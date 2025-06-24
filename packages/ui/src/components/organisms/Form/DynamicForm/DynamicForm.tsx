import { forwardRef, useImperativeHandle, useMemo } from 'react';

import { Renderer, TRendererSchema } from '../../Renderer';
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
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { HttpClientProvider } from './providers/HttpClientProvider';
import { queryClient } from './utils/query-client';
import { DocumentsService } from '../DocumentsService';
import { ValidatorWrapper } from './providers/ValidatorWrapper';
import { registerValidator } from '../Validator/utils/register-validator';
import { documentValidator } from './validators/document';
import { documentSizeValidator } from './validators/document-size';

registerValidator('document', documentValidator);
registerValidator('documentSize', documentSizeValidator);

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
      disabled,
      httpParams,
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
      schema: elements,
      onChange,
      onFieldChange,
    });
    const touchedApi = useTouched(elements, valuesApi.values);
    const fieldHelpers = useFieldHelpers<TValues>({ valuesApi, touchedApi });
    const { submit } = useSubmit<TValues>({ onSubmit });

    useImperativeHandle(ref, () => ({
      submit: () => submit(valuesApi.values),
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
        disabled,
        httpParams,
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
        disabled,
        httpParams,
      ],
    );

    const valuesAndMetadata = useMemo(() => {
      return {
        ...context.values,
        ...context.metadata,
      };
    }, [context.values, context.metadata]);

    return (
      <QueryClientProvider client={queryClient}>
        <HttpClientProvider httpParams={httpParams} metadata={metadata}>
          <DocumentsService>
            <TaskRunner>
              <EventsProvider onEvent={onEvent}>
                <DynamicFormContext.Provider value={context}>
                  <ValidatorWrapper
                    schema={validationSchema}
                    value={valuesAndMetadata}
                    {...validationParams}
                  >
                    <Renderer
                      elements={elements}
                      schema={context.elementsMap as unknown as TRendererSchema}
                    />
                  </ValidatorWrapper>
                </DynamicFormContext.Provider>
              </EventsProvider>
              <Toaster richColors />
            </TaskRunner>
          </DocumentsService>
        </HttpClientProvider>
      </QueryClientProvider>
    );
  },
);

DynamicFormV2.displayName = 'DynamicFormV2';
