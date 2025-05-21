import { useMemo } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@ballerine/common';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { userCreatedIconCell } from '../../utils/constants';

export const useAssociatedCompaniesInformationBlock = (workflows: TWorkflowById[]) => {
  return useMemo(() => {
    if (!Array.isArray(workflows) || !workflows.length) {
      return [];
    }

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
                .addCell(userCreatedIconCell)
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      type: 'heading',
                      value: `${valueOrNA(workflow?.entity?.name ?? '')} Information`,
                      props: { className: 'mt-0' },
                    })
                    .addCell({
                      type: 'subheading',
                      value: 'User-Provided Data',
                    })
                    .buildFlat(),
                })
                .buildFlat(),
              props: {
                className: 'flex space-x-1 items-center',
              },
            })
            .addCell({
              id: 'visible-title',
              type: 'details',
              hideSeparator: true,
              value: {
                title: 'Company',
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
              isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
            })
            .build()
            .flat(1),
        })
        .build();
    });
  }, [workflows]);
};
