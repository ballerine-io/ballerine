import { ctw } from '../../../../common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { Separator } from '../../../../common/components/atoms/Separator/Separator';
import React, { FunctionComponent } from 'react';
import { useParams } from '@tanstack/react-router';
import { IDetailsProps } from './interfaces';
import { useEntityWithWorkflowQuery } from '../../../../domains/entities/hooks/queries/useEntityWithWorkflowQuery/useEntityWithWorkflowQuery';

export const Details: FunctionComponent<IDetailsProps> = ({ id, value }) => {
  const { entityId } = useParams();
  const { data: entity } = useEntityWithWorkflowQuery(entityId);

  if (!value.data?.length) return;

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={entity?.workflow?.runtimeDataId}
        id={id}
        valueId={value?.id}
        documents={entity?.workflow?.workflowContext?.machineContext?.documents}
        title={value?.title}
        data={value?.data}
      />
      <Separator className={`my-2`} />
    </div>
  );
};
