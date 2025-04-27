import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ComponentProps } from 'react';

export const createKycBlocks = (individuals: ComponentProps<typeof KycBlock>[]) => {
  const blocks = createBlocksTyped().addBlock();

  if (!individuals?.length) {
    return [];
  }

  individuals.forEach(
    ({
      documents,
      entityData,
      status,
      kycSession,
      aml,
      isActionsDisabled,
      isLoadingReuploadNeeded,
      isLoadingApprove,
      onInitiateKyc,
      onInitiateSanctionsScreening,
      onApprove,
      onReuploadNeeded,
      onEdit,
      reasons,
      isReuploadNeededDisabled,
      isApproveDisabled,
      isInitiateKycDisabled,
      isInitiateSanctionsScreeningDisabled,
      isEditDisabled,
    }) => {
      blocks.addCell({
        type: 'node',
        value: (
          <KycBlock
            documents={documents}
            entityData={entityData}
            status={status}
            kycSession={kycSession}
            aml={aml}
            isActionsDisabled={isActionsDisabled}
            isLoadingReuploadNeeded={isLoadingReuploadNeeded}
            isLoadingApprove={isLoadingApprove}
            onInitiateKyc={onInitiateKyc}
            onInitiateSanctionsScreening={onInitiateSanctionsScreening}
            onApprove={onApprove}
            onReuploadNeeded={onReuploadNeeded}
            onEdit={onEdit}
            reasons={reasons}
            isReuploadNeededDisabled={isReuploadNeededDisabled}
            isApproveDisabled={isApproveDisabled}
            isInitiateKycDisabled={isInitiateKycDisabled}
            isInitiateSanctionsScreeningDisabled={isInitiateSanctionsScreeningDisabled}
            isEditDisabled={isEditDisabled}
          />
        ),
      });
    },
  );

  return blocks.build();
};
