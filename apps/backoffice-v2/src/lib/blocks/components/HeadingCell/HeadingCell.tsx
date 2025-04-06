import { FunctionComponent } from 'react';
import { IHeadingProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { FunctionComponentWithChildren } from '@ballerine/ui';

export const Heading: FunctionComponentWithChildren<{
  id?: string;
  className?: string;
}> = ({ id, children, className }) => (
  <h2
    className={ctw(
      `ml-1 mt-6 px-2 text-2xl font-bold`,
      {
        'text-2xl': id === 'nested-details-heading',
        'col-span-full': id === 'header',
      },
      className,
    )}
  >
    {children}
  </h2>
);

export const HeadingCell: FunctionComponent<IHeadingProps> = ({ id, value, props }) => (
  <Heading id={id} className={props?.className}>
    {value}
  </Heading>
);
