import { FunctionComponent } from 'react';
import { Separator } from '../../../../common/components/atoms/Separator/Separator';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { IDetailsProps } from './interfaces';

export const Details: FunctionComponent<IDetailsProps> = ({
  id,
  value,
  hideSeparator,
  contextUpdateMethod,
  workflowId,
  documents = [],
  onSubmit,
}) => {
  if (!value.data?.length) return null;

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={workflowId}
        id={id}
        valueId={value?.id}
        documents={documents}
        title={value?.title}
        data={value?.data}
        contextUpdateMethod={contextUpdateMethod}
        onSubmit={onSubmit}
      />
      {!hideSeparator && <Separator className={`my-2`} />}
    </div>
  );
};
