import * as React from 'react';
import { type ForwardedRef, forwardRef, Fragment } from 'react';

import type { BlocksProps, Cells } from '@/blocks';

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
        {blocks?.map((block, blockIndex) => {
          if (!Array.isArray(block) || !block?.length) {
            return null;
          }

          const typesInBlock = block?.map(({ type }) => type)?.join(':');
          const blockKey = `block:${typesInBlock}:${blockIndex}`;
          const cellsList = block?.map(({ type, ...cell }, cellIndex) => {
            const Cell = cells[type];
            const cellKey = `${(cell[cell?.keyProp as keyof typeof cell] as string) ?? ''}:${
              (cell?.id as string) ?? ''
            }`;

            return (
              <Fragment key={cellKey === ':' ? `block:${blockIndex}:cell:${cellIndex}` : cellKey}>
                {
                  // @ts-expect-error - expects the consumer of `@ballerine/blocks` to register `Blocks.cells` for type safety.
                  children(Cell, cell, block)
                }
              </Fragment>
            );
          });

          if (!Block) {
            return <Fragment key={blockKey}>{cellsList}</Fragment>;
          }

          return (
            <Block
              key={blockKey}
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
