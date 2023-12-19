import React, { FunctionComponent } from 'react';

import { ISubheadingProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';

export const Subheading: FunctionComponent<ISubheadingProps> = ({ value, props }) => (
  <h3 className={ctw(`ml-[5px] px-2 text-sm font-bold`, props?.className)}>{value}</h3>
);
