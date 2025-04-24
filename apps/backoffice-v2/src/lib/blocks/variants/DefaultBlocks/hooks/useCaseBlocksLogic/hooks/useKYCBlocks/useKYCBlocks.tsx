import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { ComponentProps, useMemo } from 'react';
import { createKycBlocks } from '../../utils/create-kyc-blocks';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { NoIndividualsSvg } from '@/common/components/atoms/icons';

export const useKYCBlocks = (individuals: Array<ComponentProps<typeof KycBlock>>) => {
  const kycBlocks = useMemo(() => {
    if (individuals?.length) {
      return createKycBlocks(individuals);
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'noData',
        value: {
          title: 'No Individuals Data Available',
          description: `Individual's information is still being collected or not available.`,
          icon: <NoIndividualsSvg />,
        },
        props: {},
      })
      .build();
  }, [individuals]);

  return kycBlocks;
};
