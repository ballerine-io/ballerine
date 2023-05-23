import { ctw } from '../../../../../utils/ctw/ctw';
import { EditableDetails } from 'components/pages/Individual/components/EditableDetails/EditableDetails';
import { Separator } from 'components/atoms/Separator/separator';
import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';

export const Details = ({ id, value }) => {
  const { endUserId } = useParams();
  const { data: endUser } = useEndUserWithWorkflowQuery(endUserId);

  if (!value.data?.length) return;

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={endUser?.workflow?.runtimeDataId}
        id={id}
        valueId={value?.id}
        documents={endUser?.workflow?.workflowContext?.machineContext?.documents}
        title={value?.title}
        data={value?.data}
      />
      <Separator className={`my-2`} />
    </div>
  );
};
