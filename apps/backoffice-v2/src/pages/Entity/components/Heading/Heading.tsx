import React, { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';

export const Heading: FunctionComponent<ExtractCellProps<'heading'>> = ({ id, value, props }) => (
  <h2
    className={ctw(
      `ml-1 mt-6 px-2 text-2xl font-bold`,
      {
        'text-2xl': id === 'nested-details-heading',
        'col-span-full': id === 'header',
      },
      props?.className,
    )}
  >
    {value}
  </h2>
);
