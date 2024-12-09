import { FunctionComponent, ComponentProps, useCallback, ChangeEvent } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { ExtendedJson } from '@/common/types';
import { isValidDatetime } from '@/common/utils/is-valid-datetime';
import { FileJson2 } from 'lucide-react';
import { JsonDialog, ctw, BallerineLink, checkIsDate } from '@ballerine/ui';
import { isObject, isNullish, checkIsIsoDate, checkIsUrl } from '@ballerine/common';
import { Input } from '@ballerine/ui';
import { Select } from '../../../atoms/Select/Select';
import { SelectTrigger } from '../../../atoms/Select/Select.Trigger';
import { SelectValue } from '../../../atoms/Select/Select.Value';
import { SelectContent } from '../../../atoms/Select/Select.Content';
import { SelectItem } from '../../../atoms/Select/Select.Item';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { Checkbox_ } from '../../../atoms/Checkbox_/Checkbox_';
import dayjs from 'dayjs';
import { ReadOnlyDetailV2 } from './ReadOnlyDetailV2';
import { getDisplayValue } from '../utils/get-display-value';
import { FormField } from '../../Form/Form.Field';
import { FormControl } from '../../Form/Form.Control';
import { getInputType } from '../utils/get-input-type';

export const EditableDetailV2: FunctionComponent<{
  isEditable: boolean;
  className?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  form: UseFormReturn<FieldValues>;
  field: Parameters<ComponentProps<typeof FormField>['render']>[0]['field'];
  valueAlias?: string;
  originalValue: ExtendedJson;
  type: string | undefined;
  format: string | undefined;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  parse?: {
    date?: boolean;
    isoDate?: boolean;
    datetime?: boolean;
    boolean?: boolean;
    url?: boolean;
    nullish?: boolean;
  };
}> = ({
  isEditable,
  className,
  options,
  originalValue,
  form,
  field,
  valueAlias,
  type,
  format,
  minimum,
  maximum,
  pattern,
  parse,
}) => {
  const displayValue = getDisplayValue({ value: field.value, originalValue, isEditable });
  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value === 'N/A' ? '' : event.target.value;

      form.setValue(field.name, value);
    },
    [field.name, form],
  );

  if (Array.isArray(field.value) || isObject(field.value)) {
    return (
      <div className={ctw(`flex items-end justify-start`, className)}>
        <JsonDialog
          buttonProps={{
            variant: 'link',
            className: 'p-0 text-blue-500',
          }}
          rightIcon={<FileJson2 size={`16`} />}
          dialogButtonText={`View Information`}
          json={JSON.stringify(field.value)}
        />
      </div>
    );
  }

  if (isEditable && options) {
    return (
      <Select disabled={!isEditable} onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="h-9 w-full border-input p-1 shadow-sm">
            <SelectValue />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options?.map(({ label, value }, index) => {
            return (
              <SelectItem key={keyFactory(label, index?.toString(), `select-item`)} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  if (parse?.boolean && (typeof field.value === 'boolean' || type === 'boolean')) {
    return (
      <FormControl>
        <Checkbox_
          disabled={!isEditable}
          checked={field.value}
          onCheckedChange={field.onChange}
          className={ctw('border-[#E5E7EB]', className)}
        />
      </FormControl>
    );
  }

  if (isEditable) {
    const inputType = getInputType({ format, type, value: originalValue });

    return (
      <FormControl>
        <Input
          {...field}
          {...(typeof minimum === 'number' && { min: minimum })}
          {...(typeof maximum === 'number' && { max: maximum })}
          {...(pattern && { pattern })}
          {...(inputType === 'datetime-local' && { step: '1' })}
          type={inputType}
          value={displayValue}
          onChange={onInputChange}
          autoComplete={'off'}
          className={ctw(`p-1`, {
            'text-slate-400': isNullish(field.value) || field.value === '',
          })}
        />
      </FormControl>
    );
  }

  if (typeof field.value === 'boolean' || type === 'boolean') {
    return <ReadOnlyDetailV2 className={className}>{`${field.value}`}</ReadOnlyDetailV2>;
  }

  if (parse?.url && checkIsUrl(field.value)) {
    return (
      <BallerineLink href={field.value} className={className}>
        {valueAlias ?? field.value}
      </BallerineLink>
    );
  }

  if (parse?.datetime && (isValidDatetime(field.value) || type === 'date-time')) {
    const value = field.value.endsWith(':00') ? field.value : `${field.value}:00`;

    return (
      <ReadOnlyDetailV2 className={className}>
        {dayjs(value).utc().format('DD/MM/YYYY HH:mm')}
      </ReadOnlyDetailV2>
    );
  }

  if (
    (parse?.date && checkIsDate(field.value, { isStrict: false })) ||
    (parse?.isoDate && checkIsIsoDate(field.value)) ||
    (type === 'date' && (parse?.date || parse?.isoDate))
  ) {
    return (
      <ReadOnlyDetailV2 className={className}>
        {dayjs(field.value).format('DD/MM/YYYY')}
      </ReadOnlyDetailV2>
    );
  }

  if (parse?.nullish && isNullish(field.value)) {
    return <ReadOnlyDetailV2 className={className}>{field.value}</ReadOnlyDetailV2>;
  }

  if (isNullish(field.value)) {
    return <ReadOnlyDetailV2 className={className}>{`${field.value}`}</ReadOnlyDetailV2>;
  }

  return <ReadOnlyDetailV2 className={className}>{field.value}</ReadOnlyDetailV2>;
};
