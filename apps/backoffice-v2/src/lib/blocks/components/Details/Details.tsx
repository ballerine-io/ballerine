import { Separator } from '@/common/components/atoms/Separator/Separator';
import { ctw } from '@/common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent, useMemo } from 'react';
import { sortData } from '@/lib/blocks/utils/sort-data';

export const Details: FunctionComponent<ExtractCellProps<'details'>> = ({
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

  const sortedData = useMemo(
    () =>
      sortData({
        data: value.data,
        direction: props?.config?.sort?.direction,
        predefinedOrder: props?.config?.sort?.predefinedOrder,
      }),
    [value.data, props?.config?.sort?.direction, props?.config?.sort?.predefinedOrder],
  );

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
        valueId={value.id}
        documents={documents}
        title={value.title}
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
