import { CellContext, RowData } from '@tanstack/react-table';
import { isValidDate } from '../../../../common/utils/is-valid-date';
import { isValidIsoDate } from '../../../../common/utils/is-valid-iso-date/is-valid-iso-date';
import { formatDate } from '../../../../common/utils/format-date';
import dayjs from 'dayjs';
import { isNullish, isObject } from '@ballerine/common';
import { JsonDialog } from '../../../../common/components/molecules/JsonDialog';
import { FileJson2 } from 'lucide-react';
import { isValidUrl } from '../../../../common/utils/is-valid-url';
import { buttonVariants } from '../../../../common/components/atoms/Button/Button';
import React from 'react';

export const DefaultCell = <TData extends RowData, TValue = unknown>(
  props: CellContext<TData, TValue>,
) => {
  const value = props.getValue();

  if (isNullish(value) || value === '') {
    return <span className={`text-slate-400`}>N/A</span>;
  }

  if (isValidDate(value, { isStrict: false }) || isValidIsoDate(value)) {
    return formatDate(dayjs(value).toDate());
  }

  if (isObject(value) || Array.isArray(value)) {
    return (
      <div className={`flex items-end justify-start`}>
        <JsonDialog
          buttonProps={{
            variant: 'link',
            className: 'p-0 text-blue-500 h-[unset]',
          }}
          rightIcon={<FileJson2 size={`16`} />}
          dialogButtonText={`View Information`}
          json={JSON.stringify(value)}
        />
      </div>
    );
  }

  if (isValidUrl(value)) {
    return (
      <a
        className={buttonVariants({
          variant: 'link',
          className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
        })}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={value}
      >
        {value}
      </a>
    );
  }

  return value;
};
