import React, { FunctionComponent } from 'react';

import { IParagraphProps } from './interfaces';
import { ctw } from '@/common/utils/ctw/ctw';

export const Paragraph: FunctionComponent<IParagraphProps> = ({ value, props }) => (
  <p className={ctw(`ml-[5px] px-2`, props?.className)}>{value}</p>
);
