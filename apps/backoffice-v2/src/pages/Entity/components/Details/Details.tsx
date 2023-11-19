import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import { Separator } from '../../../../common/components/atoms/Separator/Separator';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { IDetailsProps } from './interfaces';

export const Details: FunctionComponent<IDetailsProps> = ({
  id,
  value,
  hideSeparator,
  documents,
  contextUpdateMethod,
}) => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });

  if (!value.data?.length) return;

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={workflow?.id}
        id={id}
        valueId={value?.id}
        documents={documents ?? workflow?.context?.documents}
        title={value?.title}
        data={value?.data}
        contextUpdateMethod={contextUpdateMethod}
      />
      {!hideSeparator && <Separator className={`my-2`} />}
    </div>
  );
};
