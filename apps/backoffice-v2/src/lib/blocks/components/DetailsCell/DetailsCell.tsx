import { Separator } from '@/common/components/atoms/Separator/Separator';
import { ctw } from '@/common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent } from 'react';
import { sortData } from '@/lib/blocks/utils/sort-data';

export const Details: FunctionComponent<{
  title: string;
  data: any[];
  config: {};
  id: string;
  workflowId: string;
  directorId: string;
  documents: any[];
  onSubmit: () => void;
  isSaveDisabled: boolean;
  contextUpdateMethod: 'base' | 'director';
  isDocumentsV2: boolean;
  hideSeparator: boolean;
}> = ({
  title,
  data,
  config,
  id,
  workflowId,
  directorId,
  documents,
  onSubmit,
  isSaveDisabled,
  contextUpdateMethod,
  isDocumentsV2,
  hideSeparator,
}) => {
  const sortedData = sortData({
    data,
    direction: config?.sort?.direction,
    predefinedOrder: config?.sort?.predefinedOrder,
  });

  return (
    <div
      className={ctw(`m-2 rounded p-1`, {
        'pt-4': id === 'entity-details',
      })}
    >
      <EditableDetails
        workflowId={workflowId}
        directorId={directorId}
        id={id}
        valueId={id}
        documents={documents}
        title={title}
        data={sortedData}
        isSaveDisabled={isSaveDisabled}
        contextUpdateMethod={contextUpdateMethod}
        onSubmit={onSubmit}
        isDocumentsV2={isDocumentsV2}
      />
      {!hideSeparator && <Separator className={`my-2`} />}
    </div>
  );
};

export const DetailsCell: FunctionComponent<ExtractCellProps<'details'>> = ({
  id,
  value,
  hideSeparator,
  contextUpdateMethod,
  directorId,
  workflowId,
  documents = [],
  onSubmit,
  isSaveDisabled,
  props,
  isDocumentsV2,
}) => {
  if (!value.data?.length) {
    return null;
  }

  return (
    <Details
      title={value.title}
      data={value.data}
      config={props?.config}
      id={id}
      workflowId={workflowId}
      directorId={directorId}
      documents={documents}
      onSubmit={onSubmit}
      isSaveDisabled={isSaveDisabled}
      contextUpdateMethod={contextUpdateMethod}
      isDocumentsV2={isDocumentsV2}
      hideSeparator={hideSeparator}
    />
  );
};
