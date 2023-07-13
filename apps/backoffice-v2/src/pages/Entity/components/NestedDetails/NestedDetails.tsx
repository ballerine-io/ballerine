import { NestedComponent } from '../NestedComponent/NestedComponent';
import { FunctionComponent } from 'react';
import { ExtractCellProps } from '@ballerine/blocks';

export const NestedDetails: FunctionComponent<ExtractCellProps<'nestedDetails'>> = ({
  id,
  value,
}) => {
  if (!value?.data?.length) return;

  return (
    <div className={`ml-3`}>
      <NestedComponent id={id} value={value} />
    </div>
  );
};
