import { JsonDialog } from '../../../../common/components/molecules/JsonDialog';
import React, { FunctionComponent } from 'react';
import { IJsonDialogCellProps } from './interfaces';
import { FileJson2 } from 'lucide-react';
import { ctw } from '../../../../common/utils/ctw/ctw';

export const JsonDialogCell: FunctionComponent<IJsonDialogCellProps> = ({ value, props }) => {
  return (
    <JsonDialog
      rightIcon={<FileJson2 size={`16`} />}
      dialogButtonText={`View Information`}
      json={JSON.stringify(value)}
      {...props}
      buttonProps={{
        variant: 'link',
        ...props?.buttonProps,
        className: ctw('p-0 text-blue-500', props?.buttonProps?.className),
      }}
    />
  );
};
