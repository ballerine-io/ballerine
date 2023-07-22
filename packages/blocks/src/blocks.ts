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

export const createBlocks =
  <TCell extends Cell | InvalidCellMessage = InvalidCellMessage>() =>
  <TInitialBlocks extends Blocks = []>(options: BlocksOptions<TInitialBlocks> = {}) =>
    new BlocksBuilder<
      // @ts-expect-error - A generic should always be provided.
      TCell,
      InferLastArrayElement<TInitialBlocks>,
      [],
      TInitialBlocks
    >([], options);

export class BlocksBuilder<
  TCell extends Cell,
  TLastBlock extends Block = [],
  TBlocks extends Blocks = [],
  TInitialBlocks extends Blocks = [],
> {
  #__options: BlocksOptions<TInitialBlocks>;
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
    return this.#__blocks[blockIndex]?.[cellIndex];
  }

  constructor(blocks: TBlocks, options: BlocksOptions<TInitialBlocks>) {
    this.#__blocks = blocks;
    this.#__options = options;

    this.#__logger('`BlocksBuilder`: Created an instance');

    if (Array.isArray(this.#__options?.initialBlocks)) {
      this.#__blocks.push(...this.#__options.initialBlocks);

      this.#__logger('`BlocksBuilder`: Added initial blocks');
    }

    this.build = this.build.bind(this);
    this.addCell = this.addCell.bind(this);
    this.addBlock = this.addBlock.bind(this);
  }

  addBlock() {
    if (this.#__lastBlock && !this.#__lastCell) {
      return raise(
        'Attempted to call `addBlock` before calling `addCell`. Did you mean to pass `initialBlocks` to `createBlocks` or call `addBlocks`?',
      );
    }

    this.#__blocks.push([] as any);

    this.#__logger('`BlocksBuilder`: Added a block');

    return this as BlocksBuilder<TCell, [], TBlocks, TInitialBlocks>;
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    if (!this.#__lastBlock) {
      return raise(
        'Attempted to call `addCell` before calling `addBlock`. Did you mean to pass `initialBlocks` to `createBlocks` or call `addBlocks`?',
      );
    }

    this.#__lastBlock.push(cell);

    this.#__logger('`BlocksBuilder`: Added a cell a block');

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
  addBlocks<TBlocksType extends Blocks>(blocks: TBlocksType) {
    this.#__blocks.push(...blocks);

    this.#__logger('`BlocksBuilder`: Added blocks');

    return this as unknown as BlocksBuilder<
      TCell,
      InferLastArrayElement<TBlocksType> extends Block ? InferLastArrayElement<TBlocksType> : never,
      TBlocksType,
      TBlocksType
    >;
  }

  build() {
    if (!this.#__lastBlock) {
      return raise(
        'Attempted to call `build` before calling `addBlock`. Did you mean to pass `initialBlocks` to `createBlocks` or call `addBlocks`?   ',
      );
    }

    if (!this.#__lastCell) {
      return raise(
        'Attempted to call `build` before calling `addCell`. Did you mean to pass `initialBlocks` to `createBlocks` or call `addBlocks`?',
      );
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
