import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '../../../../common/components/organisms/Form/Form';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { Button, buttonVariants } from '../../../../common/components/atoms/Button/Button';
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { AnyRecord } from '../../../../common/types';
import { IEditableDetails } from './interfaces';
import { useUpdateWorkflowByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { FormField } from '../../../../common/components/organisms/Form/Form.Field';
import { FormItem } from '../../../../common/components/organisms/Form/Form.Item';
import { FormLabel } from '../../../../common/components/organisms/Form/Form.Label';
import { FormControl } from '../../../../common/components/organisms/Form/Form.Control';
import { FormMessage } from '../../../../common/components/organisms/Form/Form.Message';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { useWatchDropdownOptions } from './hooks/useWatchDropdown';
import { keyFactory } from '../../../../common/utils/key-factory/key-factory';
import { isNullish, isObject } from '@ballerine/common';
import { isValidUrl } from '../../../../common/utils/is-valid-url';
import { JsonDialog } from '../../../../common/components/molecules/JsonDialog/JsonDialog';
import { FileJson2 } from 'lucide-react';
import { isValidDate } from '../../../../common/utils/is-valid-date';
import { isValidIsoDate } from '../../../../common/utils/is-valid-iso-date/is-valid-iso-date';

const useInitialCategorySetValue = ({ form, data }) => {
  useEffect(() => {
    const categoryValue = form.getValues('category');

    form.setValue('category', categoryValue);
  }, [form, data]);
};

export const EditableDetails: FunctionComponent<IEditableDetails> = ({
  data,
  valueId,
  id,
  documents,
  title,
  workflowId,
}) => {
  const [formData, setFormData] = useState(data);
  const POSITIVE_VALUE_INDICATOR = ['approved'];
  const NEGATIVE_VALUE_INDICATOR = ['revision', 'rejected', 'declined'];
  const isDecisionPositive = (isDecisionComponent: boolean, value: string) => {
    return isDecisionComponent && value && POSITIVE_VALUE_INDICATOR.includes(value.toLowerCase());
  };
  const isDecisionNegative = (isDecisionComponent: boolean, value: string) => {
    return isDecisionComponent && value && NEGATIVE_VALUE_INDICATOR.includes(value.toLowerCase());
  };
  const defaultValues = formData?.reduce((acc, curr) => {
    acc[curr.title] = curr.value;

    return acc;
  }, {});
  const form = useForm({
    defaultValues,
  });
  const { mutate: mutateUpdateWorkflowById } = useUpdateWorkflowByIdMutation({
    workflowId,
  });
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
  const onSubmit: SubmitHandler<Record<PropertyKey, unknown>> = formData => {
    const context = {
      documents: documents?.map(document => {
        if (document?.id !== valueId) return document;

        const properties = Object.keys(document?.propertiesSchema?.properties ?? {}).reduce(
          (acc, curr) => {
            if (!formData?.[curr]) return acc;
            acc[curr] = formData?.[curr];

            return acc;
          },
          {},
        );

        return {
          ...document,
          type: formData.type,
          category: formData.category,
          properties: properties,
        };
      }),
    };

    return onMutateTaskDecisionById({
      context,
      action: 'update_document_properties',
    });
  };
  const isDecisionComponent = title === 'Decision';

  useWatchDropdownOptions({ form, data, setFormData });
  useInitialCategorySetValue({
    form,
    data,
  });

  // Ensures that the form is reset when the data changes from other instances of `useUpdateWorkflowByIdMutation` i.e. in `useCaseCallToActionLogic`.
  useEffect(() => {
    form.reset(defaultValues);
  }, [form.reset, data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex h-full flex-col`}>
        <legend className={ctw({ 'sr-only': id !== 'visible-title' }, 'mb-2 font-bold')}>
          {title}
        </legend>
        <div
          className={ctw(`grid grid-cols-2 gap-4 gap-y-6`, {
            'grid-cols-3': id === 'entity-details',
          })}
        >
          {formData?.map(
            ({ title, isEditable, type, format, pattern, value, valueAlias, dropdownOptions }) => {
              const originalValue = form.watch(title);

              const displayValue = (value: unknown) => {
                if (isEditable) return originalValue;

                return isNullish(value) || value === '' ? 'Unavailable' : value;
              };

              const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value;

                form.setValue(title, inputValue === 'Unavailable' ? '' : inputValue);
              };

              return (
                <FormField
                  key={keyFactory(valueId, title, `form-field`)}
                  control={form.control}
                  name={title}
                  render={({ field }) => {
                    if (isDecisionComponent && !value) return null;

                    const isInput = [
                      !isValidUrl(value) || isEditable,
                      !isObject(value),
                      !Array.isArray(value),
                    ].every(Boolean);
                    const isSelect = isInput && !!dropdownOptions;
                    const inputType = (() => {
                      if (format) {
                        return format;
                      }

                      if (type === 'string') {
                        return 'text';
                      }

                      if (isValidDate(value, false) || isValidIsoDate(value) || type === 'date') {
                        return 'date';
                      }

                      return type;
                    })();

                    return (
                      <FormItem>
                        <FormLabel>{toStartCase(camelCaseToSpace(title))}</FormLabel>
                        {(isObject(value) || Array.isArray(value)) && (
                          <div
                            className={`flex items-end justify-start`}
                            key={keyFactory(valueId, title, `form-field`)}
                          >
                            <JsonDialog
                              buttonProps={{
                                variant: 'link',
                                className: 'p-0 text-blue-500',
                              }}
                              rightIcon={<FileJson2 size={`16`} />}
                              dialogButtonText={`View Information`}
                              json={JSON.stringify(value)}
                            />
                          </div>
                        )}
                        {isValidUrl(value) && !isEditable && (
                          <a
                            key={keyFactory(valueId, title, `form-field`)}
                            className={buttonVariants({
                              variant: 'link',
                              className: '!block cursor-pointer !p-0 !text-blue-500',
                            })}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={value}
                          >
                            {(valueAlias as string) ?? value}
                          </a>
                        )}
                        {isSelect && (
                          <Select
                            disabled={!isEditable}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dropdownOptions?.map(({ label, value }, index) => {
                                return (
                                  <SelectItem
                                    key={keyFactory(
                                      id,
                                      valueId,
                                      label,
                                      index?.toString(),
                                      `select-item`,
                                    )}
                                    value={value}
                                  >
                                    {label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                        {isInput && !isSelect && (
                          <FormControl>
                            <Input
                              type={inputType}
                              disabled={!isEditable}
                              className={ctw(
                                `p-1 disabled:cursor-auto disabled:border-none disabled:bg-transparent disabled:opacity-100`,
                                {
                                  '!h-[unset] !p-0': !isEditable,
                                  'font-bold text-success': isDecisionPositive(
                                    isDecisionComponent,
                                    field.value,
                                  ),
                                  'font-bold text-destructive': isDecisionNegative(
                                    isDecisionComponent,
                                    field.value,
                                  ),
                                },
                              )}
                              {...(pattern && { pattern })}
                              autoComplete={'off'}
                              {...field}
                              value={displayValue(originalValue)}
                              onChange={handleInputChange}
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              );
            },
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
