import { valueOrFallback } from '@/common/utils/value-or-fallback/value-or-fallback';
import { valueOrNone } from '@/pages/Entity/pdfs/case-information/utils/value-or-none';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

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
