import { FunctionComponent } from 'react';
import { IDataFieldProps } from '../DataField/interfaces';
import { AnyRecord, DivComponent } from '../../../types';

export interface IDetailsGridProps<TRecord extends AnyRecord>
  extends Omit<DivComponent, 'children'> {
  data: TRecord;
  title: string;
  header?: JSX.Element;
  footer?: JSX.Element;
  children: FunctionComponent<IDataFieldProps & { index: number }>;
  loading?: {
    title?: boolean;
    data?: boolean;
  };
}
