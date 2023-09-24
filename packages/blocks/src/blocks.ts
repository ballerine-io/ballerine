import type {
  Block,
  Blocks,
  BlocksOptions,
  Cell,
  InferAllButLastArrayElements,
  InferLastArrayElement,
  InvalidCellMessage,
} from '@/types';
import { dump, log, raise } from '@ballerine/common';

export const createBlocks = <TCell extends Cell | InvalidCellMessage = InvalidCellMessage>(
  options: BlocksOptions = {},
) =>
  new BlocksBuilder<// @ts-expect-error - A generic should always be provided.
  TCell>([], options);

export class BlocksBuilder<
  TCell extends Cell,
  TLastBlock extends Block = { cells: [] },
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
    return this.#__lastBlock?.cells?.[this.#__lastBlock?.cells?.length - 1];
  }

  get blocksCount() {
    return this.#__blocks?.length ?? 0;
  }

  cellsCount(blockIndex: number) {
    return this.#__blocks[blockIndex]?.cells?.length ?? 0;
  }

  blockAt<TIndex extends number>(index: TIndex) {
    return this.#__blocks[index];
  }

  cellAt<TBlockIndex extends number, TCellIndex extends number>(
    blockIndex: TBlockIndex,
    cellIndex: TCellIndex,
  ) {
    return this.#__blocks[blockIndex]?.cells?.[
      cellIndex
    ] as TBlocks[TBlockIndex]['cells'][TCellIndex];
  }

  constructor(blocks: TBlocks, options: BlocksOptions) {
    this.#__blocks = blocks;
    this.#__options = options;

    this.#__logger('`BlocksBuilder`: Created an instance');

    this.build = this.build.bind(this);
    this.addCell = this.addCell.bind(this);
    this.addBlock = this.addBlock.bind(this);
  }

  addBlock<
    TProps extends {
      [key: string]: unknown;
    },
  >(props?: TProps) {
    if (this.#__lastBlock && !this.#__lastCell) {
      return raise('Attempted to call `addBlock` before calling `addCell`.');
    }

    this.#__blocks.push({ ...props, cells: [] } as any);

    this.#__logger('`BlocksBuilder`: Added a block');

    return this as BlocksBuilder<TCell, TProps & { cells: [] }, TBlocks>;
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    if (!this.#__lastBlock) {
      return raise('Attempted to call `addCell` before calling `addBlock`.');
    }

    this.#__lastBlock?.cells?.push(cell);

    this.#__logger('`BlocksBuilder`: Added a cell a block');

    return this as unknown as BlocksBuilder<
      TCell,
      {
        cells: [...TLastBlock['cells'], TCellType];
      },
      TLastBlock['cells'] extends []
        ? [...TBlocks, { cells: [TCellType] }]
        : [
            // Spread the previous blocks.
            ...InferAllButLastArrayElements<TBlocks>,
            {
              cells: [
                // Spread the previous cells to a single block.
                // Avoids a block with a single cell.
                ...InferAllButLastArrayElements<TLastBlock['cells']>,
                InferLastArrayElement<TLastBlock['cells']> extends Cell
                  ? InferLastArrayElement<TLastBlock['cells']>
                  : never,
                // Add the new cell.
                TCellType,
              ];
            },
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
      raise('`BlocksBuilder`: Failed to serialize logger payload', error);
    }
  }
}
