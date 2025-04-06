import { ChangeEvent, useCallback } from 'react';
import { checkIsFormattedDatetime } from '@/common/utils/check-is-formatted-datetime';
import { FileJson2 } from 'lucide-react';
import { BallerineLink, CountrySelect, ctw, Input, JsonDialog } from '@ballerine/ui';
import { checkIsCountry, checkIsUrl, isNullish, isObject } from '@ballerine/common';
import { Select } from '../../../../atoms/Select/Select';
import { SelectTrigger } from '../../../../atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../atoms/Select/Select.Value';
import { SelectContent } from '../../../../atoms/Select/Select.Content';
import { SelectItem } from '../../../../atoms/Select/Select.Item';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { Checkbox_ } from '../../../../atoms/Checkbox_/Checkbox_';
import dayjs from 'dayjs';
import { ReadOnlyDetailV2 } from '../ReadOnlyDetailV2';
import { getDisplayValue } from '../../utils/get-display-value';
import { FormControl } from '../../../Form/Form.Control';
import { getInputType } from '../../utils/get-input-type';
import { checkIsDate } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-date';
import { checkIsDatetime } from '@/common/components/organisms/EditableDetailsV2/utils/check-is-datetime';
import { getName } from 'i18n-iso-countries';

export const EditableDetailV2 = ({
  isEditable,
  className,
  options,
  formValue,
  onInputChange,
  onOptionChange,
  name,
  value,
  valueAlias,
  type,
  format,
  minimum,
  maximum,
  pattern,
  inputType,
  parse,
}: {
  isEditable: boolean;
  className?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  name: string;
  value: any;
  onInputChange: (name: string, value: unknown) => void;
  onOptionChange: (...event: any[]) => void;
  valueAlias?: string;
  formValue: any;
  type: string | undefined;
  format: string | undefined;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  inputType?: string;
  parse?: {
    date?: boolean;
    isoDate?: boolean;
    datetime?: boolean;
    boolean?: boolean;
    url?: boolean;
    nullish?: boolean;
    country?: boolean;
  };
}) => {
  const displayValue = getDisplayValue({ value, formValue, isEditable });
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const getValue = () => {
        if (event.target.value === 'N/A') {
          return '';
        }

        const isValidDatetime = dayjs(
          event.target.value,
          ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DDTHH:mm:ss'],
          true,
        ).isValid();

        if (isValidDatetime) {
          return dayjs(event.target.value).toISOString();
        }

        return event.target.value;
      };
      const value = getValue();

      onInputChange(name, value);
    },
    [name, onInputChange],
  );
  const isValidDatetime = [
    checkIsDatetime(value),
    checkIsFormattedDatetime(value),
    type === 'date-time',
  ].some(Boolean);
  const isValidIsoDate = checkIsDatetime(value);

  if (Array.isArray(value) || isObject(value)) {
    return (
      <div className={ctw(`flex items-end justify-start`, className)}>
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
    );
  }

  if (isEditable && options) {
    return (
      <Select onValueChange={onOptionChange} defaultValue={formValue}>
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

  if (
    parse?.boolean &&
    (typeof value === 'boolean' || type === 'boolean' || inputType === 'checkbox')
  ) {
    return (
      <FormControl>
        <Checkbox_
          disabled={!isEditable}
          checked={isEditable ? formValue : value}
          onCheckedChange={onOptionChange}
          className={ctw('border-[#E5E7EB]', className)}
        />
      </FormControl>
    );
  }

  if (isEditable && inputType === 'country') {
    return (
      <CountrySelect value={displayValue} onChange={onOptionChange}>
        <FormControl>
          <CountrySelect.Trigger className="h-9 w-full border-input p-1 shadow-sm">
            <CountrySelect.Value />
          </CountrySelect.Trigger>
        </FormControl>
        <CountrySelect.Content locale={'en'}>
          {country => (
            <CountrySelect.Item value={country.const}>{country.title}</CountrySelect.Item>
          )}
        </CountrySelect.Content>
      </CountrySelect>
    );
  }

  if (isEditable) {
    const computedInputType = inputType ?? getInputType({ format, type, value });

    return (
      <FormControl>
        <Input
          {...(typeof minimum === 'number' && { min: minimum })}
          {...(typeof maximum === 'number' && { max: maximum })}
          {...(pattern && { pattern })}
          {...(computedInputType === 'datetime-local' && { step: '1' })}
          type={computedInputType}
          value={displayValue}
          onChange={handleInputChange}
          autoComplete={'off'}
          className={`p-1`}
        />
      </FormControl>
    );
  }

  if (typeof value === 'boolean' || type === 'boolean') {
    return <ReadOnlyDetailV2 className={className}>{`${value}`}</ReadOnlyDetailV2>;
  }

  if (parse?.url && checkIsUrl(value)) {
    return (
      <BallerineLink href={value} className={className}>
        {valueAlias ?? value}
      </BallerineLink>
    );
  }

  if ((parse?.datetime && isValidDatetime) || (parse?.isoDate && isValidIsoDate)) {
    return (
      <ReadOnlyDetailV2 className={className}>
        {dayjs(value).local().format('DD/MM/YYYY HH:mm')}
      </ReadOnlyDetailV2>
    );
  }

  if (parse?.date && (checkIsDate(value) || type === 'date')) {
    return (
      <ReadOnlyDetailV2 className={className}>{dayjs(value).format('DD/MM/YYYY')}</ReadOnlyDetailV2>
    );
  }

  if (parse?.nullish && isNullish(value)) {
    return <ReadOnlyDetailV2 className={className}>{value}</ReadOnlyDetailV2>;
  }

  if (isNullish(value)) {
    return <ReadOnlyDetailV2 className={className}>{`${value}`}</ReadOnlyDetailV2>;
  }

  if (parse?.country && inputType === 'country') {
    return <ReadOnlyDetailV2 className={className}>{getName(value, 'en')}</ReadOnlyDetailV2>;
  }

  return <ReadOnlyDetailV2 className={className}>{value}</ReadOnlyDetailV2>;
};
