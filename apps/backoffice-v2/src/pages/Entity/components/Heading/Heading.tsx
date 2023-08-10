import React, { FunctionComponent } from 'react';
import { IHeadingProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';

export const Heading: FunctionComponent<IHeadingProps> = ({ id, value }) => (
  <h2
    className={ctw(`ml-1 mt-6 p-2 text-2xl font-bold`, {
      'text-2xl': id === 'nested-details-heading',
      'col-span-full': id === 'header',
    })}
  >
    {value}
  </h2>
);
