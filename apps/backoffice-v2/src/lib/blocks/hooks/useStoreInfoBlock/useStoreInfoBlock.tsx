import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';

export const useStoreInfoBlock = ({ storeInfo, workflow }) => {
  if (Object.keys(storeInfo ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Store Info',
        },
        {
          type: 'subheading',
          value: 'User-provided data',
        },
        {
          type: 'container',
          value: [
            {
              type: 'details',
              value: {
                data: Object.entries(omitPropsFromObject(storeInfo, 'websiteUrls'))?.map(
                  ([title, value]) => ({
                    title,
                    value,
                    isEditable: false,
                  }),
                ),
              },
              workflowId: workflow?.id,
              documents: workflow?.context?.documents,
              hideSeparator: true,
            },
            {
              type: 'table',
              value: {
                columns: [
                  {
                    accessorKey: 'websiteUrl',
                    header: 'Website URLs',
                  },
                ],
                data: storeInfo?.websiteUrls
                  ? storeInfo?.websiteUrls
                      ?.split(',')
                      ?.map(websiteUrl => ({ websiteUrl: websiteUrl?.trim() }))
                  : [],
              },
              hideSeparator: true,
            },
          ],
        },
      ],
    },
  ];
};
