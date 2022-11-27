import { IDataFieldProps } from '../../components/molecules/DataField/interfaces';
import { FunctionComponent } from 'react';
import { GridProps } from '@mantine/core';

export interface IDetailsGridProps<TRecord extends Record<PropertyKey, any>> extends Omit<GridProps, 'children'> {
  data: TRecord;
  title: string;
  Header?: JSX.Element;
  Footer?: JSX.Element;
  children: FunctionComponent<IDataFieldProps>;
}
