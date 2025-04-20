import { FunctionComponent } from 'react';
import { useKycBlock } from './hooks/useKycBlock/useKycBlock';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { BlocksComponent } from '@ballerine/blocks';

export const KycBlock: FunctionComponent<Parameters<typeof useKycBlock>[0]> = ({
  documents,
  kycSession,
  aml,
  entityData,
  status,
  isActionsDisabled,
  isLoadingReuploadNeeded,
  isLoadingApprove,
  onInitiateKyc,
  onInitiateSanctionsScreening,
  onApprove,
  onReuploadNeeded,
  reasons,
  isReuploadNeededDisabled,
  isApproveDisabled,
  isInitiateKycDisabled,
  isInitiateSanctionsScreeningDisabled,
}) => {
  const childTasks = useKycBlock({
    documents,
    kycSession,
    aml,
    entityData,
    status,
    isActionsDisabled,
    isLoadingReuploadNeeded,
    isLoadingApprove,
    onInitiateKyc,
    onInitiateSanctionsScreening,
    onApprove,
    onReuploadNeeded,
    reasons,
    isReuploadNeededDisabled,
    isApproveDisabled,
    isInitiateKycDisabled,
    isInitiateSanctionsScreeningDisabled,
  });

  return (
    <BlocksComponent blocks={childTasks} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
