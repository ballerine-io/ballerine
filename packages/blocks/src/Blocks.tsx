import * as React from 'react';
import { ForwardedRef, forwardRef, Fragment } from 'react';
import type { BlocksProps } from './types';

export const Blocks = forwardRef(
  ({ cells, blocks, children, Block = Fragment }: BlocksProps, ref: ForwardedRef<typeof Block>) => {
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
                // @ts-expect-error - `Fragment` does not expect a `ref` prop
                ref={ref}
              >
                {Array.isArray(block) &&
                  !!block?.length &&
                  block?.map(cell => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    const Cell = cells[cell?.type];

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
Blocks.displayName = 'Blocks';
