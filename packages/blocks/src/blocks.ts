import { dump, log, raise } from '@ballerine/common';
import type { ComponentProps, FunctionComponent, ReactNode } from 'react';

/**
 * A cell may have any property as long as it has a `type` property to discriminate a union by.
 */
export type Cell = { type: string } & {
  [key: string]: unknown;
};

export type Block = Cell[];

export type Blocks = Block[];

export type FlattenOnce<T extends any[]> = T extends [infer U, ...infer V]
  ? U extends any[]
    ? [...U, ...FlattenOnce<V extends any[] ? V : []>]
    : [U, ...FlattenOnce<V extends any[] ? V : []>]
  : [];

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
  // cells: ReturnType<typeof createBlocks<TCell>>;
}

/**
 * Infer the generic passed into an instance of `BlocksBuilder`.
 */
type InferBlocksBuilderGeneric<TClass extends BlocksBuilder<any>> = TClass extends BlocksBuilder<
  infer TCell
>
  ? TCell
  : never;

/**
 * Infer the generic passed into the instance of `BlocksBuilder` registered by the consumer of `@ballerine/blocks`.
 */
export type Cells =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  InferBlocksBuilderGeneric<BlocksClient['cells']>;

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

export type InferAllButLastArrayElements<T extends any[]> = T extends [...infer U, any] ? U : [];

export type InferLastArrayElement<T extends any[]> = T extends [...any, infer U] ? U : never;

export type InferArrayElement<T extends any[]> = T extends Array<infer U> ? U : never;

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
  blocks: TCell[][];
  /**
   * The `block` prop is only passed when the `Block` property component is passed.
   */
  Block?: FunctionComponent<{
    children: ReactNode | ReactNode[];
    block: TCell[];
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
    block: TCell[],
  ) => ReactNode | ReactNode[];
}

export type InvalidCellMessage =
  "Please provide a union of available cell types discriminated by '{ type: string; }'";

export interface BlocksOptions {
  debug?: boolean;
  verbose?: boolean;
}

export class BlocksBuilder<
  TCell extends Cell,
  TLastBlock extends Block = [],
  TBlocks extends Blocks = [],
> {
  #__options: BlocksOptions;
  #__blocks: TBlocks;

  get #__lastBlockIndex() {
    return this.#__blocks?.length - 1;
  }

  get #__lastBlock(): Block | undefined {
    return this.#__blocks[this.#__lastBlockIndex];
  }

  set #__lastBlock(block: Block) {
    this.#__blocks[this.#__lastBlockIndex] = block;
  }

  get #__lastCell(): Cell | undefined {
    return this.#__lastBlock?.[this.#__lastBlock.length - 1];
  }

  get blocksCount() {
    return this.#__blocks?.length ?? 0;
  }

  cellsCount(blockIndex: number) {
    return this.#__blocks[blockIndex]?.length ?? 0;
  }

  blockAt<TIndex extends number>(index: TIndex) {
    return this.#__blocks[index];
  }

  cellAt<TBlockIndex extends number, TCellIndex extends number>(
    blockIndex: TBlockIndex,
    cellIndex: TCellIndex,
  ) {
    return this.#__blocks[blockIndex]?.[cellIndex] as TBlocks[TBlockIndex][TCellIndex];
  }

  constructor(blocks: TBlocks, options: BlocksOptions) {
    this.#__blocks = blocks;
    this.#__options = options;

    this.#__logger('`BlocksBuilder`: Created an instance');

    this.build = this.build.bind(this);
    this.addCell = this.addCell.bind(this);
    this.addBlock = this.addBlock.bind(this);
  }

  addBlock() {
    if (this.#__lastBlock && !this.#__lastCell) {
      return raise('Attempted to call `addBlock` before calling `addCell`.');
    }

    this.#__blocks.push([] as any);

    this.#__logger('`BlocksBuilder`: Added a block');

    return this as BlocksBuilder<TCell, [], TBlocks>;
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    if (!this.#__lastBlock) {
      return raise('Attempted to call `addCell` before calling `addBlock`.');
    }

    this.#__lastBlock.push(cell);

    this.#__logger('`BlocksBuilder`: Added a cell');

    return this as unknown as BlocksBuilder<
      TCell,
      [...TLastBlock, TCellType],
      TLastBlock extends []
        ? [...TBlocks, [TCellType]]
        : [
            // Spread the previous blocks.
            ...InferAllButLastArrayElements<TBlocks>,
            [
              // Spread the previous cells to a single block.
              // Avoids a block with a single cell.
              ...InferAllButLastArrayElements<TLastBlock>,
              InferLastArrayElement<TLastBlock>,
              // Add the new cell.
              TCellType,
            ],
          ]
    >;
  }

  build() {
    if (!this.#__lastBlock) {
      return raise('Attempted to call `build` before calling `addBlock`.');
    }

    if (!this.#__lastCell) {
      return raise('Attempted to call `build` before calling `addCell`.');
    }

    return this.#__blocks;
  }

  buildFlat() {
    return this.#__blocks.flat(1) as FlattenOnce<TBlocks>;
  }

  #__logger(message: string) {
    try {
      log(!!this.#__options?.debug, {
        message,
        options: this.#__options,
        block: dump(this.#__lastBlock),
        blocksCount: this.blocksCount,
        cell: dump(this.#__lastCell),
        cellsCount: this.cellsCount(this.#__lastBlockIndex),
        ...(this.#__options.verbose ? { blocks: dump(this.#__blocks)?.replace(/\n/g, '') } : {}),
      });
    } catch (error) {
      if (!this.#__options?.debug) return;

      console.error('`BlocksBuilder`: Failed to serialize logger payload', error);
    }
  }
}

export const createBlocks = <TCell extends Cell | InvalidCellMessage = InvalidCellMessage>(
  options: BlocksOptions = {},
) =>
  new BlocksBuilder<// @ts-expect-error - A generic should always be provided.
  TCell>([], options);
