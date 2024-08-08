import { CellContext, RowData } from '@tanstack/react-table';
import { checkIsDate } from 'src/common/utils/check-is-date';
import { formatDate } from '@/common/utils/format-date';
import dayjs from 'dayjs';
import { checkIsIsoDate, checkIsUrl, isNullish, isObject } from '@ballerine/common';
import { FileJson2 } from 'lucide-react';
import React from 'react';
import { buttonVariants, JsonDialog } from '@/components';

export const DefaultTableCell = <TData extends RowData, TValue = unknown>(
  props: CellContext<TData, TValue>,
) => {
  const value = props.getValue();

  if (isNullish(value) || value === '') {
    return <span className={`text-slate-400`}>N/A</span>;
  }

  if (checkIsDate(value, { isStrict: false }) || checkIsIsoDate(value)) {
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

  if (checkIsUrl(value)) {
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
