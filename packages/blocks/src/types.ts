import { FunctionComponent, ReactNode } from 'react';
import { BlocksBuilder } from '@/blocks';

export type Cell = { type: string } & Record<string, unknown>;

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
export type Cells =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  InferBlocksBuilderGeneric<Blocks['cells']>;

/**
 * Extract the type of cell from the registered cells.
 */
export type CellType = Cells['type'];

/**
 * Extract the props of a cell by type from the registered cells.
 * @example
 * const Cell: FunctionComponent<ExtractCellProps<'text'>> = ({ text }) => <p>{text}</p>;
 */
export type ExtractCellProps<TType extends CellType> = Omit<
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
  [TType in CellType]: FunctionComponent<ExtractCellProps<TType>>;
};

export type InferAllButLastArrayElements<T extends Array<any>> = T extends [...infer U, any]
  ? U
  : [];

export type InferLastArrayElement<T extends Array<any>> = T extends [...any, infer U] ? U : never;

export interface BlocksProps {
  cells: CellsMap;
  blocks: Array<Array<Cells>>;
  Block: FunctionComponent<{
    children: ReactNode | Array<ReactNode>;
    block: Array<Cells>;
  }>;
  children: (
    Cell: CellsMap[keyof CellsMap],
    cell: Cells,
    block: Array<Array<Cells>>,
  ) => ReactNode | Array<ReactNode>;
}
