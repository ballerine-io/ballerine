import { ComponentProps } from 'react';
import { JsonDialog } from '../../../../common/components/molecules/JsonDialog';
import { Serializable } from '@ballerine/common';

export interface IJsonDialogCellProps {
  value: Serializable;
  props?: ComponentProps<typeof JsonDialog>;
}
