import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '../../../../common/components/organisms/Form/Form';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { Button } from '../../../../common/components/atoms/Button/Button';
import React, { FunctionComponent } from 'react';
import { AnyRecord } from '../../../../common/types';
import { IEditableDetails } from './interfaces';
import { useUpdateWorkflowByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { FormField } from '../../../../common/components/organisms/Form/Form.Field';
import { FormItem } from '../../../../common/components/organisms/Form/Form.Item';
import { FormLabel } from '../../../../common/components/organisms/Form/Form.Label';
import { FormControl } from '../../../../common/components/organisms/Form/Form.Control';
import { FormMessage } from '../../../../common/components/organisms/Form/Form.Message';

export const EditableDetails: FunctionComponent<IEditableDetails> = ({
  data,
  valueId,
  id,
  documents,
  title,
  workflowId,
}) => {
  const { mutate: mutateUpdateWorkflowById } = useUpdateWorkflowByIdMutation({
    workflowId,
  });
  const POSITIVE_VALUE_INDICATOR = ['approved'];
  const NEGATIVE_VALUE_INDICATOR = ['revision', 'rejected'];
  const isDecisionPositive = (isDecisionComponent: boolean, value) => {
    return (
      isDecisionComponent && value && POSITIVE_VALUE_INDICATOR.includes(String(value).toLowerCase())
    );
  };
  const isDecisionNegative = (isDecisionComponent: boolean, value) => {
    return (
      isDecisionComponent && value && NEGATIVE_VALUE_INDICATOR.includes(String(value).toLowerCase())
    );
  };
  const onMutateTaskDecisionById = ({
    context,
    action,
  }: {
    context: AnyRecord;
    action: Parameters<typeof mutateUpdateWorkflowById>[0]['action'];
  }) =>
    mutateUpdateWorkflowById({
      context,
      action,
    });
  const defaultValues = data?.reduce((acc, curr) => {
    acc[curr.title] = curr.value;

    return acc;
  }, {});
  const form = useForm({
    defaultValues,
  });
  const onSubmit: SubmitHandler<Record<PropertyKey, unknown>> = data => {
    const context = {
      documents: documents?.map(document => {
        if (document?.id !== valueId) return document;

        return {
          ...document,
          properties: Object.keys(document?.propertiesSchema?.properties ?? {}).reduce(
            (acc, curr) => {
              if (!data?.[curr]) return acc;
              acc[curr] = data?.[curr];

              return acc;
            },
            {},
          ),
        };
      }),
    };

    return onMutateTaskDecisionById({
      context,
      action: 'update_document_properties',
    });
  };
  const isDecisionComponent = title === 'Decision';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex h-full flex-col`}>
        <legend className={`sr-only`}>{title}</legend>
        <div
          className={ctw(`grid grid-cols-2 gap-4`, {
            'grid-cols-3': id === 'entity-details',
          })}
        >
          {data?.map(({ title, isEditable, type, format, pattern, value }) =>
            isDecisionComponent && !value ? null : (
              <FormField
                key={title}
                control={form.control}
                name={title}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toStartCase(camelCaseToSpace(title))}</FormLabel>
                    <FormControl>
                      <Input
                        type={!format ? (type === 'string' ? 'text' : type) : format}
                        disabled={!isEditable}
                        className={ctw(
                          `p-1 disabled:cursor-auto disabled:border-none disabled:bg-background disabled:opacity-100`,
                          {
                            'font-bold text-success': isDecisionPositive(
                              isDecisionComponent,
                              value,
                            ),
                            'font-bold text-destructive': isDecisionNegative(
                              isDecisionComponent,
                              value,
                            ),
                          },
                        )}
                        pattern={pattern}
                        autoComplete={'off'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}
        </div>
        <div className={`flex justify-end`}>
          {data?.some(({ isEditable }) => isEditable) && (
            <Button type="submit" className={`ms-auto mt-3`}>
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
