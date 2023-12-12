import { ctw } from '@/common/utils/ctw/ctw';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Card } from '@/common/components/atoms/Card/Card';
import { useChildDocumentBlocksLogic } from '@/pages/Entity/components/ChildDocumentBlocks/hooks/useChildDocumentBlocksLogic/useChildDocumentBlocksLogic';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { UnknownRecord } from '@/common/types';

import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

interface IChildDocumentBlocksProps {
  parentWorkflowId: string;
  childWorkflow: TWorkflowById['childWorkflows'][number];
  parentMachine: UnknownRecord;
}

export const ChildDocumentBlocks: FunctionComponent<IChildDocumentBlocksProps> = ({
  parentWorkflowId,
  childWorkflow,
  parentMachine,
}) => {
  const childDocumentBlocks = useChildDocumentBlocksLogic({
    parentWorkflowId,
    childWorkflow,
    parentMachine,
  });

  if (!Array.isArray(childDocumentBlocks) || !childDocumentBlocks?.length) return null;

  return (
    <>
      {childDocumentBlocks?.map((childDocumentBlock, index) => (
        <Card
          key={index}
          className={ctw(
            'me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]',
            childDocumentBlock.className,
          )}
        >
          <CardContent
            className={ctw('grid gap-2', {
              'grid-cols-2': childDocumentBlock?.cells.some(
                cell => cell?.type === 'multiDocuments',
              ),
            })}
          >
            {childDocumentBlock?.cells.map((cell, index) => {
              const Cell = cells[cell?.type];

              return <Cell key={index} {...cell} />;
            })}
          </CardContent>
        </Card>
      ))}
    </>
  );
};
