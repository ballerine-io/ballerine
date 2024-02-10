import * as React from 'react';
import { ForwardedRef, forwardRef, Fragment } from 'react';

import { BlocksProps, Cells } from '@/blocks';

export const BlocksComponent = forwardRef(
  <TCell extends Cells>(
    { cells, blocks, children, Block }: BlocksProps<TCell>,
    ref: ForwardedRef<typeof Block>,
  ) => {
    if (!Array.isArray(blocks) || !blocks?.length) {
      return null;
    }

    return (
      <>
        {blocks?.map((block, index) => {
          if (!Array.isArray(block) || !block?.length) {
            return null;
          }

          const typesInBlock = block?.map(({ type }) => type)?.join(':');
          const key = `block:${typesInBlock}:${index}`;
          const cellsList = block?.map(({ type, ...cell }) => {
            const Cell = cells[type];

            return (
              <Fragment
                key={`${(cell[cell?.keyProp as keyof typeof cell] as string) ?? ''}:${
                  (cell?.id as string) ?? ''
                }`}
              >
                {
                  // @ts-expect-error - expects the consumer of `@ballerine/blocks` to register `Blocks.cells` for type safety.
                  children(Cell, cell, block)
                }
              </Fragment>
            );
          });

          if (!Block) {
            return <Fragment key={key}>{cellsList}</Fragment>;
          }

          return (
            <Block
              key={key}
              block={block}
              // TODO: Find a way to type ref for a component not known at compile time.
              // @ts-ignore
              ref={ref}
            >
              {cellsList}
            </Block>
          );
        })}
      </>
    );
  },
);
BlocksComponent.displayName = 'Blocks';
