import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { Block } from '@ballerine/blocks';
import { FunctionComponent } from 'react';

interface IBlockCellProps {
  value: Block;
  props?: {
    className?: string;
    contentClassName?: string;
  };
}

export const BlockCell: FunctionComponent<IBlockCellProps> = ({ value, props }) => {
  if (!Array.isArray(value) || !value?.length) {
    return null;
  }

  return (
    <Card className={ctw('shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', props?.className)}>
      <CardContent
        className={ctw(
          'grid gap-2',
          {
            'grid-cols-2': value?.some(cell => cell?.type === 'multiDocuments'),
          },
          props?.contentClassName,
        )}
      >
        {value?.map((cell, index) => {
          const Cell = cells[cell?.type];
          const key = keyFactory(
            'block',
            cell[cell?.keyProp as keyof typeof cell],
            cell?.id,
            index,
          );

          return <Cell key={key} {...cell} />;
        })}
      </CardContent>
    </Card>
  );
};
