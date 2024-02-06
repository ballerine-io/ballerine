import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface FilterContainerProps {
  children: AnyChildren;
}

export const FilterContainer: FunctionComponent<FilterContainerProps> = ({ children }) => {
  return <div className="relative flex flex-col gap-1">{children}</div>;
};
