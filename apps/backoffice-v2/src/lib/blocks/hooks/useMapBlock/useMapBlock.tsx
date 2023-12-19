import { useMemo } from 'react';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { getAddressDeep } from '@/pages/Entity/hooks/useEntityLogic/utils/get-address-deep/get-address-deep';
import { useNominatimQuery } from '@/lib/blocks/components/MapCell/hooks/useNominatimQuery/useNominatimQuery';

export const useMapBlock = ({ filteredPluginsOutput, entityType, workflow }) => {
  const address = getAddressDeep(filteredPluginsOutput, {
    propertyName: 'registeredAddressInFull',
  });
  const { data: locations, isLoading } = useNominatimQuery(address);

  return useMemo(() => {
    if (
      !address ||
      Object.keys(address ?? {})?.length === 0 ||
      (!isLoading && (!Array.isArray(locations) || !locations?.length))
    ) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'map-container',
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                id: 'header',
                type: 'heading',
                value: `${valueOrNA(toTitleCase(entityType ?? ''))} Address`,
              })
              .addCell({
                type: 'details',
                hideSeparator: true,
                value: {
                  title: `${valueOrNA(toTitleCase(entityType ?? ''))} Address`,
                  data:
                    typeof address === 'string'
                      ? [
                          {
                            title: 'Address',
                            value: address,
                            isEditable: false,
                          },
                        ]
                      : Object.entries(address ?? {})?.map(([title, value]) => ({
                          title,
                          value,
                          isEditable: false,
                        })),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
              })
              .addCell({
                type: 'map',
                value: address,
              })
              .build()
              .flat(1),
          })
          .build()
          .flat(1),
      })
      .build();
  }, [address, isLoading, locations, entityType, workflow?.id, workflow?.context?.documents]);
};
