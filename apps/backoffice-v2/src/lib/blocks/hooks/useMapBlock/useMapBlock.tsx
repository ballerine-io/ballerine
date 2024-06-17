import { useNominatimQuery } from '@/lib/blocks/components/MapCell/hooks/useNominatimQuery/useNominatimQuery';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useMemo } from 'react';
import { useAddressBlock } from '@/lib/blocks/hooks/useAddressBlock/useAddressBlock';

export const useMapBlock = ({ address, entityType, workflow }) => {
  const { data: locations, isLoading } = useNominatimQuery(address);
  const addressBlock = useAddressBlock({ address, entityType, workflow });

  return useMemo(() => {
    if (
      !address ||
      Object.keys(address ?? {})?.length === 0 ||
      (!isLoading && (!Array.isArray(locations) || !locations?.length))
    ) {
      return [];
    }

    const mapBlock = createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'map',
        value: address,
      })
      .buildFlat();

    const addressWithMapBlock = addressBlock.flat(1).map(block => ({
      ...block,
      value: block.value.concat(mapBlock),
    }));

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: addressWithMapBlock.flat(1),
      })
      .build();
  }, [address, isLoading, locations, addressBlock]);
};
