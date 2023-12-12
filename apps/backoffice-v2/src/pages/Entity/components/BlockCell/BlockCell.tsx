import { ctw } from '@/common/utils/ctw/ctw';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Card } from '@/common/components/atoms/Card/Card';
import { cells } from '../../hooks/useEntity/cells';
import { FunctionComponent } from 'react';
import { ExtractCellProps } from '@ballerine/blocks';

export const BlockCell: FunctionComponent<ExtractCellProps<'block'>> = ({ value, props }) => {
  console.log(value);
  return (
    <Card className={ctw('me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', props?.className)}>
      <CardContent
        className={ctw('grid gap-2', {
          'grid-cols-2': value?.some(cell => cell?.type === 'multiDocuments'),
        })}
      >
        {value?.map((cell, index) => {
          const Cell = cells[cell?.type];
          const cellKeyProp = cell[cell?.keyProp as keyof typeof cell] ?? '';
          const key = `${cellKeyProp ? `${cellKeyProp}:` : ''}${cell?.id ?? ''}`;

          return <Cell key={key || index} {...cell} />;
        })}
      </CardContent>
    </Card>
  );
};
