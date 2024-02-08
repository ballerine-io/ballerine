import { useMemo } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useAssociatedCompaniesInformationBlock = (workflows: TWorkflowById[]) => {
  return useMemo(() => {
    if (!Array.isArray(workflows) || !workflows.length) return [];

    return workflows.flatMap(workflow => {
      const { additionalInfo, ...entityData } = workflow?.context?.entity?.data ?? {};

      if (Object.keys(entityData).length === 0) {
        return [];
      }

      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'heading',
                  value: `${valueOrNA(workflow?.entity?.name ?? '')} Information`,
                })
                .addCell({
                  type: 'subheading',
                  value: 'User-Provided Data',
                })
                .build()
                .flat(1),
            })
            .addCell({
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
            })
            .addCell({
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
            })
            .build()
            .flat(1),
        })
        .build();
    });
  }, [workflows]);
};
