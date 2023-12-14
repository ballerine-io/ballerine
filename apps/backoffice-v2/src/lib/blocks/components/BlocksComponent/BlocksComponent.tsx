import { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { ctw } from '@/common/utils/ctw/ctw';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { cells } from '@/pages/Entity/hooks/useEntity/cells';
import { IBlocksComponentProps } from '@/lib/blocks/components/BlocksComponent/interfaces';

export const BlocksComponent: FunctionComponent<IBlocksComponentProps> = ({ blocks }) => {
  if (!Array.isArray(blocks) || !blocks?.length) {
    return null;
  }

  return blocks?.map((block, index) => {
    if (!Array.isArray(block?.cells) || !block?.cells?.length) return;

    return (
      <Card
        key={index}
        className={ctw('me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', block.className)}
      >
        <CardContent
          className={ctw('grid gap-2', {
            'grid-cols-2': block?.cells.some(cell => cell?.type === 'multiDocuments'),
          })}
        >
          {block?.cells.map((cell, index) => {
            const Cell = cells[cell?.type];
            const cellKeyProp = (cell[cell?.keyProp as keyof typeof cell] as string) ?? '';
            const key = `${cellKeyProp ? `${cellKeyProp}:` : ''}${(cell?.id as string) ?? ''}`;

            return <Cell key={key || index} {...cell} />;
          })}
        </CardContent>
      </Card>
    );
  });
};
