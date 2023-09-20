import React, { FunctionComponent } from 'react';

import { ISubheadingProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';

export const Subheading: FunctionComponent<ISubheadingProps> = ({ value }) => (
  <span className={ctw(`ml-[5px] px-2 text-sm font-bold`)}>{value}</span>
);
