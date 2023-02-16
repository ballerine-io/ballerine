import { ComponentProps } from 'react';
import { DivComponent } from '../../../types';

export interface IDataFieldProps extends DivComponent {
  title: string;
  text: string;
  titleProps?: ComponentProps<'h4'>;
  textProps?: ComponentProps<'p'>;
  loading?: {
    title?: boolean;
    text?: boolean;
  };
}
