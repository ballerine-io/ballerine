import { valueOrNone } from '@/common/utils/value-or-none/value-or-none';
import { tw, Typography } from '@ballerine/react-pdf-toolkit';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { valueOrFallback } from '@ballerine/common';

interface IValueOrNoneProps {
  value?: unknown;
}

const NONE_TEXT_HEX_COLOR = '#999999';
const valueOrNoneTextColor = valueOrFallback(NONE_TEXT_HEX_COLOR, { checkFalsy: true });

export const ValueOrNone: FunctionComponent<IValueOrNoneProps> = ({ value }) => {
  return (
    <Typography
      styles={[
        tw(
          `text-[8px] leading-[1.45rem] ${
            valueOrNoneTextColor(value) === NONE_TEXT_HEX_COLOR
              ? `text-[${valueOrNoneTextColor(value)}]`
              : ''
          }`,
        ),
      ]}
    >
      {valueOrNone(value) as AnyChildren}
    </Typography>
  );
};
