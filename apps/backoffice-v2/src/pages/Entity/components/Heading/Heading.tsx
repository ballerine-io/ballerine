import React, { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';

export const Heading: FunctionComponent<ExtractCellProps<'heading'>> = ({ id, value }) => (
  <h2
    className={ctw(`ml-2 mt-6 p-2 text-2xl font-bold`, {
      'text-lg text-slate-400': id === 'nested-details-heading',
      'col-span-full': id === 'map-header',
    })}
  >
    {value}
  </h2>
);
