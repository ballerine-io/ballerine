import * as React from 'react';
import { ForwardedRef, forwardRef, Fragment } from 'react';
import type { BlocksProps, Cells } from './types';

export const BlocksComponent = forwardRef(
  <TCell extends Cells>(
    { cells, blocks, children, Block = Fragment }: BlocksProps<TCell>,
    ref: ForwardedRef<typeof Block>,
  ) => {
    return (
      <>
        {Array.isArray(blocks) &&
          !!blocks?.length &&
          blocks?.map((block, index) => {
            return (
              <Block
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                key={`block:${block?.[block?.keyProp as keyof typeof block] ?? index}`}
                block={block}
                // @ts-expect-error - `Fragment` does not have a `ref` prop.
                ref={ref}
              >
                {Array.isArray(block) &&
                  !!block?.cells?.length &&
                  block?.cells?.map(({ type, ...cell }) => {
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
                  })}
              </Block>
            );
          })}
      </>
    );
  },
);
BlocksComponent.displayName = 'Blocks';
