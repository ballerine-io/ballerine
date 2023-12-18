import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';

export const useAssociatedCompaniesInformationBlock = (workflows: Array<TWorkflowById>) => {
  if (!Array.isArray(workflows) || !workflows?.length) return [];

  return workflows?.flatMap(workflow => {
    const { additionalInfo, ...entityData } = workflow?.context?.entity?.data ?? {};

    if (Object.keys(entityData).length === 0) {
      return [];
    }

    return [
      {
        cells: [
          {
            type: 'container',
            value: [
              {
                type: 'heading',
                value: `${valueOrNA(workflow?.entity?.name ?? '')} Information`,
              },
              {
                type: 'subheading',
                value: 'User-provided data',
              },
            ],
          },
          {
            id: 'visible-title',
            type: 'details',
            hideSeparator: true,
            value: {
              title: 'Company Information',
              data: Object.entries(entityData)?.map(([title, value]) => ({
                title,
                value,
              })),
            },
          },
          {
            id: 'visible-title',
            type: 'details',
            hideSeparator: true,
            value: {
              title: 'Registered Address',
              data: Object.entries(additionalInfo?.headquarters ?? {})?.map(([title, value]) => ({
                title,
                value,
              })),
            },
          },
        ],
      },
    ];
  });
};
