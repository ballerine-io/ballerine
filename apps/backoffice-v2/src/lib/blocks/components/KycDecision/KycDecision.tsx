import { Separator } from '@/common/components/atoms/Separator/Separator';
import { ctw } from '@/common/utils/ctw/ctw';
import { EditableDetails } from '../EditableDetails/EditableDetails';
import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent } from 'react';
import { sortData } from '@/lib/blocks/utils/sort-data';
import { Badge } from '@ballerine/ui';

const RISK_TO_LABEL = {
  allowedAge: 'Disallowed Age',
  faceLiveness: 'Face is not Lively',
  documentNotExpired: 'Document expired',
  geolocationMatch: 'No geolocation match',
  documentAccepted: 'Document not accepted',
  faceNotInBlocklist: 'Face is in blocklist',
  allowedIpLocation: 'Disallowed IP location',
  faceImageAvailable: 'Face image unavailable',
  documentRecognised: 'Document not recognized',
  faceSimilarToPortrait: 'Face not similar to portrait',
  validDocumentAppearance: 'Invalid document appearance',
  expectedTrafficBehaviour: 'Unexpected traffic behavior',
  physicalDocumentPresent: 'Physical document not present',
  documentBackFullyVisible: 'Document back not fully visible',
  documentFrontFullyVisible: 'Document front not fully visible',
  documentBackImageAvailable: 'Document back image unavailable',
  faceImageQualitySufficient: 'Face image quality insufficient',
  documentFrontImageAvailable: 'Document front image unavailable',
  documentImageQualitySufficient: 'Document image quality insufficient',
} as const;

export const KycDecision: FunctionComponent<ExtractCellProps<'kycDecision'>> = ({
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

  const sortedData = sortData({
    data: value.data,
    direction: props?.config?.sort?.direction,
    predefinedOrder: props?.config?.sort?.predefinedOrder,
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
        valueId={value.id}
        documents={documents}
        title={value.title}
        data={sortedData}
        isSaveDisabled={isSaveDisabled}
        contextUpdateMethod={contextUpdateMethod}
        onSubmit={onSubmit}
        isDocumentsV2={isDocumentsV2}
      />
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-sm font-medium">Issues</p>
        <div className="flex flex-col space-y-4">
          {value.riskLabels.map(item => (
            <Badge key={item} variant={'warning'} className={`max-w-[30ch] text-sm font-bold`}>
              {RISK_TO_LABEL[item as keyof typeof RISK_TO_LABEL] ?? item}
            </Badge>
          ))}
        </div>
      </div>
      {!hideSeparator && <Separator className={`my-2`} />}
    </div>
  );
};
