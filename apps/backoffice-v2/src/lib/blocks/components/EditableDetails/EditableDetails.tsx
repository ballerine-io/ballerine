import { checkIsIsoDate, checkIsUrl, isNullish, isObject, valueOrNA } from '@ballerine/common';
import { checkIsDate, JsonDialog } from '@ballerine/ui';
import { Check, Copy, FileJson2 } from 'lucide-react';
import {
  ChangeEvent,
  ComponentProps,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toTitleCase } from 'string-ts';
import { Button, buttonVariants } from '../../../../common/components/atoms/Button/Button';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Form } from '../../../../common/components/organisms/Form/Form';
import { FormControl } from '../../../../common/components/organisms/Form/Form.Control';
import { FormField } from '../../../../common/components/organisms/Form/Form.Field';
import { FormItem } from '../../../../common/components/organisms/Form/Form.Item';
import { FormLabel } from '../../../../common/components/organisms/Form/Form.Label';
import { FormMessage } from '../../../../common/components/organisms/Form/Form.Message';
import { AnyRecord } from '../../../../common/types';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { keyFactory } from '../../../../common/utils/key-factory/key-factory';
import { useUpdateDocumentByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateDocumentByIdMutation/useUpdateDocumentByIdMutation';
import { useWatchDropdownOptions } from './hooks/useWatchDropdown';
import { IEditableDetails } from './interfaces';
import { isValidDatetime } from '../../../../common/utils/is-valid-datetime';
import dayjs from 'dayjs';

interface UseInitialCategorySetValueProps {
  form: ReturnType<typeof useForm<Record<string, any>>>;
  data: any[];
}

const useInitialCategorySetValue = ({ form, data }: UseInitialCategorySetValueProps) => {
  useEffect(() => {
    const categoryValue = form.getValues('category');

    form.setValue('category', categoryValue);
  }, [form, data]);
};

interface IDetailProps extends ComponentProps<'div'> {
  type: string;
  children: string;
  isDecisionComponent: boolean;
  isDecisionPositive: (isDecisionComponent: boolean, value: string) => boolean;
  isDecisionNegative: (isDecisionComponent: boolean, value: string) => boolean;
}

export const Detail: FunctionComponent<IDetailProps> = ({
  type,
  children,
  isDecisionPositive,
  isDecisionComponent,
  isDecisionNegative,
  className,
  ...props
}) => {
  const getValue = (value: unknown): string => {
    if (type === 'datetime-local') {
      return dayjs(String(value)).utc().format('DD/MM/YYYY HH:mm');
    }

    if (checkIsDate(value, { isStrict: false }) || checkIsIsoDate(value)) {
      return dayjs(String(value)).format('DD/MM/YYYY');
    }

    if (typeof value === 'boolean') {
      return value.toString();
    }

    return String(value || '');
  };
  const value = getValue(children);

  return (
    <div
      tabIndex={0}
      role="textbox"
      aria-readonly={true}
      {...props}
      className={ctw(
        'flex w-full items-center rounded-md p-1.5 text-sm',
        {
          'font-bold text-success': isDecisionPositive(isDecisionComponent, value),
          'font-bold text-destructive': isDecisionNegative(isDecisionComponent, value),
          'text-slate-400': isNullish(value) || value === '',
        },
        className,
      )}
    >
      {valueOrNA(value)}
    </div>
  );
};

export const EditableDetails: FunctionComponent<IEditableDetails> = ({
  data,
  valueId,
  id,
  directorId,
  documents,
  title,
  workflowId,
  isSaveDisabled,
  contextUpdateMethod = 'base',
  onSubmit: onSubmitCallback,
}) => {
  const [formData, setFormData] = useState(data);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const POSITIVE_VALUE_INDICATOR = ['approved'];
  const NEGATIVE_VALUE_INDICATOR = ['revision', 'rejected', 'declined'];
  const isDecisionPositive = (isDecisionComponent: boolean, value: string) => {
    if (typeof value !== 'string') {
      return false;
    }

    return isDecisionComponent && !!value && POSITIVE_VALUE_INDICATOR.includes(value.toLowerCase());
  };
  const isDecisionNegative = (isDecisionComponent: boolean, value: string) => {
    if (typeof value !== 'string') {
      return false;
    }

    return isDecisionComponent && !!value && NEGATIVE_VALUE_INDICATOR.includes(value.toLowerCase());
  };
  const formValues = useMemo(() => {
    return data?.reduce((acc: Record<string, any>, curr) => {
      acc[curr.title] = curr.value;

      return acc;
    }, {});
  }, [data]);

  const form = useForm<Record<string, any>>({
    values: formValues,
  });
  const { mutate: mutateUpdateWorkflowById } = useUpdateDocumentByIdMutation({
    directorId,
    workflowId,
    documentId: valueId,
  });
  const onMutateTaskDecisionById = ({
    document,
    action,
    contextUpdateMethod,
  }: {
    document: AnyRecord;
    action: Parameters<typeof mutateUpdateWorkflowById>[0]['action'];
    contextUpdateMethod: 'base' | 'director';
  }) =>
    mutateUpdateWorkflowById({
      document,
      action,
      contextUpdateMethod,
    });
  const onSubmit: SubmitHandler<Record<PropertyKey, unknown>> = formData => {
    const document = documents?.find(document => document?.id === valueId);
    const properties = Object.keys(document?.propertiesSchema?.properties ?? {}).reduce(
      (acc: Record<string, any>, curr) => {
        let propertyValue = formData?.[curr];
        const propertiesMap = (document?.propertiesSchema?.properties as Record<string, any>) || {};
        const isDateTimeProperty = propertiesMap[curr]?.format === 'date-time';
        const isDateProperty = propertiesMap[curr]?.format === 'date';
        const isDateOrDateTimeProperty = isDateTimeProperty || isDateProperty;

        if (isNullish(propertyValue) || (isDateOrDateTimeProperty && propertyValue === '')) {
          return acc;
        }

        // In case when date value is cleared its value should be set to null to perform successful merge.
        // Currently, date value could not be cleared because schemas doesnt not allow date values to be nullable.
        // if (isDateOrDateTimeProperty && !propertyValue) {
        //   acc[curr] = null;
        //   return acc;
        // }

        if (
          isDateTimeProperty &&
          typeof propertyValue === 'string' &&
          propertyValue?.length === 16
        ) {
          propertyValue = `${propertyValue}:00`;
        }

        acc[curr] = propertyValue;

        return acc;
      },
      {},
    );

    const newDocument = {
      ...document,
      type: formData.type,
      category: formData.category,
      properties: properties,
    };

    onSubmitCallback && onSubmitCallback(newDocument);

    return onMutateTaskDecisionById({
      document: newDocument,
      action: 'update_document_properties',
      contextUpdateMethod,
    });
  };
  const isDecisionComponent = title === 'Decision';
  const getInputType = useCallback(
    ({
      format,
      type,
      value,
    }: {
      format: string | undefined;
      type: string | undefined;
      value: unknown;
    }) => {
      if (format === 'date-time' || isValidDatetime(value)) {
        return 'datetime-local';
      }

      if (format) {
        return format;
      }

      if (type === 'string') {
        return 'text';
      }

      if (type === 'boolean') {
        return 'checkbox';
      }

      if (checkIsDate(value, { isStrict: false }) || checkIsIsoDate(value) || type === 'date') {
        return 'date';
      }

      if (!type) {
        return 'text';
      }

      return type;
    },
    [],
  );

  useWatchDropdownOptions({ form, data, setFormData });
  useInitialCategorySetValue({
    form,
    data,
  });

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
    setCopyStatus(prev => ({ ...prev, [fieldId]: true }));

    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [fieldId]: false }));
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex h-full flex-col`}>
        <legend
          className={ctw(
            { 'sr-only': id !== 'visible-title' },
            'mb-4 text-lg font-bold text-gray-800',
          )}
        >
          {title}
        </legend>
        <div
          className={ctw(`grid gap-4`, {
            'grid-cols-1 md:grid-cols-2 xl:grid-cols-3': id === 'entity-details',
            'grid-cols-1 sm:grid-cols-2': id !== 'entity-details',
          })}
        >
          {formData?.map(
            ({
              title,
              isEditable,
              type,
              format,
              minimum,
              maximum,
              pattern,
              value,
              valueAlias,
              dropdownOptions,
            }) => {
              const originalValue = form.watch(title);

              const displayValue = (value: unknown) => {
                if (isEditable) {
                  return originalValue;
                }

                return isNullish(value) || value === '' ? 'N/A' : value;
              };

              const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
                const isCheckbox = event.target.type === 'checkbox';
                const inputValue = isCheckbox ? event.target.checked : event.target.value;

                form.setValue(title, inputValue === 'N/A' ? '' : inputValue);
              };

              const fieldId = `${valueId}-${title}`;

              return (
                <FormField
                  key={keyFactory(valueId, title, `form-field`)}
                  control={form.control}
                  name={title}
                  render={({ field }) => {
                    if (isDecisionComponent && !value) {
                      return (
                        <FormItem className="hidden">
                          <FormLabel className="sr-only">{toTitleCase(title)}</FormLabel>
                          <div className="hidden" />
                        </FormItem>
                      );
                    }

                    const isInput = [
                      !checkIsUrl(value) || isEditable,
                      !isObject(value),
                      !Array.isArray(value),
                    ].every(Boolean);
                    const isSelect = isInput && !!dropdownOptions;
                    const inputType = getInputType({
                      format,
                      type,
                      value,
                    });

                    const displayableValue =
                      typeof value === 'string' || typeof value === 'number'
                        ? String(value || '')
                        : typeof value === 'boolean'
                        ? String(value)
                        : '';

                    return (
                      <FormItem className="relative h-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm transition-colors duration-200 hover:border-gray-200">
                        <div className="flex h-full">
                          <div className="flex h-full w-full items-center gap-2 p-2.5">
                            <FormLabel className="w-[30%] flex-shrink-0 truncate text-sm font-medium text-gray-600">
                              {toTitleCase(title)}
                            </FormLabel>

                            <div className="flex flex-1 items-center justify-end gap-2">
                              {/* JSON Object display */}
                              {(isObject(value) || Array.isArray(value)) && (
                                <div className="flex w-full justify-end">
                                  <JsonDialog
                                    buttonProps={{
                                      variant: 'link',
                                      className: 'text-blue-500 hover:text-blue-600 ml-auto',
                                    }}
                                    rightIcon={<FileJson2 size={16} className="ml-1" />}
                                    dialogButtonText="View Information"
                                    json={JSON.stringify(value)}
                                  />
                                </div>
                              )}

                              {/* URL links */}
                              {checkIsUrl(value) && !isEditable && (
                                <div className="flex w-full justify-end">
                                  <a
                                    key={keyFactory(valueId, title, `form-field`)}
                                    className={buttonVariants({
                                      variant: 'link',
                                      className: 'ml-auto text-blue-500 hover:text-blue-600',
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={value}
                                  >
                                    {(valueAlias as string) ?? value}
                                  </a>
                                </div>
                              )}

                              {/* Select dropdown */}
                              {isSelect && (
                                <Select
                                  key={keyFactory(field.value, title, `select`, id)}
                                  disabled={!isEditable}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full rounded-md border-gray-200 bg-white text-right focus:border-primary focus:ring-1 focus:ring-primary">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {dropdownOptions?.map(({ label, value }, index) => (
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
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {/* Read-only text values */}
                              {!isEditable && inputType !== 'checkbox' && isInput && !isSelect && (
                                <div className="flex w-full items-center justify-end gap-2">
                                  <div className="ml-auto flex items-center gap-2">
                                    <Detail
                                      type={inputType}
                                      isDecisionComponent={isDecisionComponent}
                                      isDecisionPositive={isDecisionPositive}
                                      isDecisionNegative={isDecisionNegative}
                                      className="truncate text-right"
                                    >
                                      {String(value || '')}
                                    </Detail>
                                    {displayableValue && (
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(displayableValue, fieldId)}
                                        className="flex-shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                                        title="Copy to clipboard"
                                      >
                                        {copyStatus[fieldId] ? (
                                          <Check size={14} className="text-green-500" />
                                        ) : (
                                          <Copy size={14} />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Editable inputs */}
                              {(isEditable || inputType === 'checkbox') && isInput && !isSelect && (
                                <FormControl className="flex w-full justify-end">
                                  <div className="flex w-full items-center justify-end gap-2">
                                    <Input
                                      {...field}
                                      type={inputType}
                                      {...(inputType === 'datetime-local' && { step: '1' })}
                                      {...(minimum && { min: minimum })}
                                      {...(maximum && { max: maximum })}
                                      disabled={!isEditable}
                                      className={ctw(
                                        inputType === 'checkbox' ? 'w-auto' : 'w-full',
                                        `rounded-md border-gray-200 p-2 text-right focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-auto disabled:border-none disabled:bg-transparent disabled:opacity-100`,
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
                                          'text-slate-400':
                                            isNullish(field.value) || field.value === '',
                                        },
                                      )}
                                      {...(pattern && { pattern })}
                                      autoComplete="off"
                                      value={displayValue(originalValue)}
                                      checked={originalValue}
                                      onChange={handleInputChange}
                                    />
                                    {isEditable && displayableValue && inputType !== 'checkbox' && (
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(displayableValue, fieldId)}
                                        className="flex-shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                                        title="Copy to clipboard"
                                      >
                                        {copyStatus[fieldId] ? (
                                          <Check size={14} className="text-green-500" />
                                        ) : (
                                          <Copy size={14} />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </FormControl>
                              )}
                            </div>
                            <FormMessage className="text-xs" />
                          </div>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              );
            },
          )}
        </div>
        <div className={`mt-8 flex justify-end`}>
          {data?.some(({ isEditable }) => isEditable) && (
            <Button
              type="submit"
              className={`ms-auto rounded-md bg-primary px-8 py-2 text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md aria-disabled:pointer-events-none aria-disabled:opacity-50`}
              aria-disabled={isSaveDisabled}
            >
              Save Changes
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
