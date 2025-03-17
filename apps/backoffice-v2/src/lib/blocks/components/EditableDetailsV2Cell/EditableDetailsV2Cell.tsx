import { FunctionComponent } from 'react';
import { ExtractCellProps } from '@ballerine/blocks';
import { EditableDetailsV2 } from '@/common/components/organisms/EditableDetailsV2/EditableDetailsV2';

export const EditableDetailsV2Cell: FunctionComponent<ExtractCellProps<'editableDetails'>> = ({
  value,
  props,
}) => {
  return <EditableDetailsV2 fields={value} {...props} />;
};
