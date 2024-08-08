import { checkIsIsoDate, checkIsUrl, isNullish, isObject } from '@ballerine/common';
import { BallerineLink, checkIsDate, JsonDialog, TextWithNAFallback } from '@ballerine/ui';
import { isValidDatetime } from '@/common/utils/is-valid-datetime';
import { Checkbox_ } from '@/common/components/atoms/Checkbox_/Checkbox_';
import { FunctionComponent } from 'react';
import dayjs from 'dayjs';
import { FileJson2 } from 'lucide-react';
import { ExtendedJson } from '@/common/types';
import { ctw } from '@/common/utils/ctw/ctw';

export const ReadOnlyDetail: FunctionComponent<{
  children: ExtendedJson;
  parse?: {
    date?: boolean;
    isoDate?: boolean;
    datetime?: boolean;
    boolean?: boolean;
    url?: boolean;
    nullish?: boolean;
  };
  className?: string;
}> = ({ children, parse, className }) => {
  if (Array.isArray(children) || isObject(children)) {
    return (
      <div className={ctw(`flex items-end justify-start`, className)}>
        <JsonDialog
          buttonProps={{
            variant: 'link',
            className: 'p-0 text-blue-500',
          }}
          rightIcon={<FileJson2 size={`16`} />}
          dialogButtonText={`View Information`}
          json={JSON.stringify(children)}
        />
      </div>
    );
  }

  if (parse?.datetime && isValidDatetime(children)) {
    const value = children.endsWith(':00') ? children : `${children}:00`;

    return <p className={className}>{dayjs(value).utc().format('DD/MM/YYYY HH:mm')}</p>;
  }

  if (
    (parse?.date && checkIsDate(children, { isStrict: false })) ||
    (parse?.isoDate && checkIsIsoDate(children))
  ) {
    return <p className={className}>{dayjs(children).format('DD/MM/YYYY')}</p>;
  }

  if (parse?.boolean && typeof children === 'boolean') {
    return <Checkbox_ checked={children} className={ctw('border-[#E5E7EB]', className)} />;
  }

  if (typeof children === 'boolean') {
    return <p className={className}>{`${children}`}</p>;
  }

  if (parse?.url && checkIsUrl(children)) {
    return (
      <BallerineLink href={children} className={className}>
        {children}
      </BallerineLink>
    );
  }

  if (parse?.nullish && isNullish(children)) {
    return <TextWithNAFallback className={className}>{children}</TextWithNAFallback>;
  }

  if (isNullish(children)) {
    return <p className={className}>{`${children}`}</p>;
  }

  return <p className={className}>{children}</p>;
};
