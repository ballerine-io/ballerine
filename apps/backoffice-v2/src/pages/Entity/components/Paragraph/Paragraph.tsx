import React, { FunctionComponent } from 'react';

import { IParagraphProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { isNullish } from '@ballerine/common';

export const Paragraph: FunctionComponent<IParagraphProps> = ({ value, props }) => (
  <p
    className={ctw(
      `ml-[5px] px-2`,
      {
        'text-slate-400': isNullish(value) || value === '',
      },
      props?.className,
    )}
  >
    {isNullish(value) ? 'N/A' : value.toString()}
  </p>
);
