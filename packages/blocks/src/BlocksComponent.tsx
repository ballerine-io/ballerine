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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <Block
                key={`block:${index}`}
                block={
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  block
                }
                // @ts-expect-error - `Fragment` does not have a `ref` prop.
                ref={ref}
              >
                {Array.isArray(block) &&
                  !!block?.length &&
                  block?.map(({ type, ...cell }) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    const Cell = cells[type];

                    return (
                      <Fragment
                        key={`${
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          (cell[cell?.keyProp as keyof typeof cell] as string) ?? ''
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        }:${(cell?.id as string) ?? ''}`}
                      >
                        {
                          // @ts-expect-error - expects the consumer of `@ballerine/blocks` to register `Blocks.cells` for type safety.
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
