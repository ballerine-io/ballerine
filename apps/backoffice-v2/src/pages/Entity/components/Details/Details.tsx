import { ctw } from '../../../../common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { Separator } from '../../../../common/components/atoms/Separator/Separator';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { IDetailsProps } from './interfaces';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { env } from '../../../../common/env/env';

export const Details: FunctionComponent<IDetailsProps> = ({ id, value }) => {
  const { readyState } = useWebSocket(`${env.WEBSOCKET_URL}`, {
    share: true,
    shouldReconnect: () => true,
  });

  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({
    workflowId: entityId,
    filterId,
    websocketConnectionIsOpen: readyState === ReadyState.OPEN,
  });

  if (!value.data?.length) return;

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={workflow.id}
        id={id}
        valueId={value?.id}
        documents={workflow.context.documents}
        title={value?.title}
        data={value?.data}
      />
      <Separator className={`my-2`} />
    </div>
  );
};
