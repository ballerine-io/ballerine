import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { BlocksBuilder } from '@/blocks';

/**
 * A cell may have any property as long as it has a `type` property to discriminate a union by.
 */
export type Cell = { type: string } & {
  [key: string]: unknown;
};

export type Block = Array<Cell>;

export type Blocks = Array<Block>;

/**
 * Allow the consumer of `@ballerine/blocks` to register their own cell types.
 * @example
 * declare module '@ballerine/blocks' {
 *    interface BlocksClient {
 *      cells: typeof blocks; // createBlocks<TCell>();
 *    }
 *  }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BlocksClient {
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

export type InferArrayElement<T extends Array<any>> = T extends Array<infer U> ? U : never;

export interface BlocksProps<TCell extends Cells> {
  /**
   * @description A map of cell components
   * @example
   * const cells: CellsMap = {
   *    text: TextCell,
   *    image: ImageCell,
   *  }
   */
  cells: CellsMap;
  /**
   * @description Output of `createBlocks.build()`
   * @see {@link BlockBuilder.build}
   */
  blocks: Array<Array<TCell>>;
  /**
   * The `block` prop is only passed when the `Block` property component is passed.
   */
  Block?: FunctionComponent<{
    children: ReactNode | Array<ReactNode>;
    block: Array<TCell>;
  }>;
  /**
   * @description children as a function - provides access to the current block and cell
   * @param Cell
   * @param cell
   * @param block
   */
  children: (
    Cell: CellsMap[keyof CellsMap],
    cell: ComponentProps<CellsMap[keyof CellsMap]>,
    block: Array<TCell>,
  ) => ReactNode | Array<ReactNode>;
}

export type InvalidCellMessage =
  "Please provide a union of available cell types discriminated by '{ type: string }'";

export interface BlocksOptions {
  debug?: boolean;
  verbose?: boolean;
}
