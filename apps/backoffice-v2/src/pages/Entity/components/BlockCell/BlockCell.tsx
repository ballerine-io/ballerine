import React, { ComponentProps, Fragment, FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { ctw } from '@/common/utils/ctw/ctw';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

import { cells } from '@/pages/Entity/hooks/typed-create-blocks/typed-create-blocks';
import { Block } from '@ballerine/blocks';

export const BlockCell: FunctionComponent<{
  value: {
    props?: ComponentProps<typeof Card>;
    cells: Block;
  };
}> = ({ value }) => {
  if (!Array.isArray(value?.cells) || !value?.cells?.length) {
    return null;
  }

  return (
    <Card
      className={ctw('me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', value?.props?.className)}
    >
      <CardContent
        className={ctw('grid gap-2', {
          'grid-cols-2': value?.cells.some(cell => cell?.type === 'multiDocuments'),
        })}
      >
        <>
          {value?.cells?.map((cell, index) => {
            const Cell = cells[cell?.type];
            const key = `${(cell[cell?.keyProp as keyof typeof cell] as string) ?? ''}:${
              (cell?.id as string) ?? ''
            }`;

            return <Cell key={key || index} {...cell} />;
          })}
        </>
      </CardContent>
    </Card>
  );
};
