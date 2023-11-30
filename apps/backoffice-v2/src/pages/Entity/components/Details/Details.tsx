import { FunctionComponent } from 'react';
import { Separator } from '../../../../common/components/atoms/Separator/Separator';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { IDetailsProps } from './interfaces';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const baseDetailsDocumentsSelector = (workflow: TWorkflowById) =>
  workflow?.context?.documents;

export const Details: FunctionComponent<IDetailsProps> = ({
  id,
  value,
  hideSeparator,
  contextUpdateMethod,
  workflow,
  selectDocuments = baseDetailsDocumentsSelector,
  onSubmit,
}) => {
  const documents = selectDocuments(workflow);

  if (!value.data?.length) return null;

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
