import { NestedComponent } from '../NestedComponent/NestedComponent';
import { FunctionComponent } from 'react';
import { INestedDetailsProps } from './interfaces';

export const NestedDetails: FunctionComponent<INestedDetailsProps> = ({ id, value }) => {
  if (!value?.data?.length) return;

  return (
    <div className={`ml-3 space-y-4`}>
      <NestedComponent id={id} value={value} />
    </div>
  );
};
