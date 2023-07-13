import { FunctionComponent } from 'react';

import { BlocksBuilder } from '@/blocks';

export type Cell = { type: string } & Record<string, unknown>;
export type Block<TCells extends Array<Cell>> = TCells;

/**
 * Allow the consumer of `@ballerine/blocks` to register their own cell types.
 * @example
 * declare module '@ballerine/blocks' {
 *    interface Blocks {
 *      cells: typeof blocks; // createBlocks<TCell>();
 *    }
 *  }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Blocks {
  // cells: ReturnType<typeof createBlocks>;
}

/**
 * Infer the generic passed into an instance of `BlocksBuilder`.
 */
type InferBlocksBuilderGeneric<TClass extends BlocksBuilder<any>> = TClass extends BlocksBuilder<
  infer TGeneric
>
  ? TGeneric
  : never;

/**
 * Infer the generic passed into the instance of `BlocksBuilder` registered by the consumer of `@ballerine/blocks`.
 */
type Cells =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  InferBlocksBuilderGeneric<Blocks['cells']>;

/**
 * Extract the props of a cell by type from the registered cells.
 * @example
 * const Cell: FunctionComponent<ExtractCellProps<'text'>> = ({ text }) => <p>{text}</p>;
 */
export type ExtractCellProps<TType extends Cells['type']> = Omit<
  Extract<Cells, { type: TType }>,
  'type'
>;

/**
 * A type to help build objects of cell components.
 * @example
 * const cells: CellsMap = {
 *    text: TextCell,
 *    image: ImageCell,
 *  }
 */
export type CellsMap = {
  [TType in Cells['type']]: FunctionComponent<ExtractCellProps<TType>>;
};
