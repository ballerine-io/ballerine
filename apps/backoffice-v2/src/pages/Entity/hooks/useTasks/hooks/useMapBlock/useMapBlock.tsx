import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { getAddressDeep } from '@/pages/Entity/hooks/useEntity/utils/get-address-deep/get-address-deep';
import { useNominatimQuery } from '@/pages/Entity/components/MapCell/hooks/useNominatimQuery/useNominatimQuery';

export const useMapBlock = ({ filteredPluginsOutput, entityType, workflow }) => {
  const address = getAddressDeep(filteredPluginsOutput, {
    propertyName: 'registeredAddressInFull',
  });
  const { data: locations } = useNominatimQuery(address);

  if (Object.keys(address ?? {})?.length === 0) {
    return [];
  }

  return [
    {
      cells: locations &&
        locations.length && [
          {
            id: 'map-container',
            type: 'container',
            value: [
              {
                id: 'header',
                type: 'heading',
                value: `${valueOrNA(toTitleCase(entityType ?? ''))} Address`,
              },
              {
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
              },
              {
                type: 'map',
                address,
                latitude: locations[0].lat,
                longitude: locations[0].lon,
              },
            ],
          },
        ],
    },
  ];
};
