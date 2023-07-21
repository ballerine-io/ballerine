import {
  BlocksOptions,
  Cell,
  InferAllButLastArrayElements,
  InferLastArrayElement,
  InvalidCellMessage,
} from '@/types';
import { dump, log, raise } from '@ballerine/common';

export class BlockBuilder<
  TCell extends Cell,
  TLastBlock extends Array<Cell> = [],
  TBlocks extends Array<Array<Cell>> = [],
> {
  #__options: BlocksOptions;
  #__blocks: TBlocks;

  get #__lastBlockIndex() {
    return this.#__blocks?.length - 1;
  }

  get #__lastBlock(): Array<Cell> | undefined {
    return this.#__blocks[this.#__lastBlockIndex];
  }

  set #__lastBlock(block: Array<Cell>) {
    this.#__blocks[this.#__lastBlockIndex] = block;
  }

  get #__lastCell(): Cell | undefined {
    return this.#__lastBlock?.[this.#__lastBlock.length - 1];
  }

  constructor(blocks: TBlocks, options: BlocksOptions) {
    this.#__blocks = blocks;
    this.#__options = options;

    this.#__logger('Created an instance of `BlockBuilder`');
  }

  addBlock() {
    this.#__blocks.push([] as any);

    this.#__logger('Added a block');

    return this as BlockBuilder<TCell, [], TBlocks>;
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    this.#__lastBlock!.push(cell);

    this.#__logger('Added a cell a block');

    return this as unknown as BlockBuilder<
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
    return this.#__blocks;
  }

  #__logger(message: string) {
    try {
      log(!!this.#__options?.debug, {
        message,
        options: this.#__options,
        block: dump(this.#__lastBlock),
        cell: dump(this.#__lastCell),
        ...(this.#__options.verbose ? { blocks: dump(this.#__blocks) } : {}),
      });
    } catch (error) {
      raise("Failed to serialize `BlockBuilder`'s logger payload", error);
    }
  }
}

export class EmptyBlockBuilder<TCell extends Cell, TLastBlock extends Array<Cell> = []> {
  #__options: BlocksOptions;
  #__blocks: Array<Array<Cell>> = [];

  get #__lastBlockIndex() {
    return this.#__blocks?.length - 1;
  }

  get #__lastBlock(): Array<Cell> | undefined {
    return this.#__blocks[this.#__lastBlockIndex];
  }

  set #__lastBlock(block: Array<Cell>) {
    this.#__blocks[this.#__lastBlockIndex] = block;
  }

  get #__lastCell(): Cell | undefined {
    return this.#__lastBlock?.[this.#__lastBlock.length - 1];
  }

  constructor(blocks: Array<Array<Cell>>, options: BlocksOptions) {
    this.#__blocks = blocks;
    this.#__options = options;

    this.#__logger('Created an instance of `EmptyBlockBuilder`');
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    this.#__lastBlock!.push(cell);

    this.#__logger('Added a cell a block');

    return new BlockBuilder(this.#__blocks, this.#__options) as BlockBuilder<
      TCell,
      [...TLastBlock, TCellType],
      [[...TLastBlock, TCellType]]
    >;
  }

  addBlock() {
    return raise('Attempted to call `addBlock` before calling `addCell`');
  }

  build() {
    return raise('Attempted to call `build` before calling `addCell`');
  }

  #__logger(message: string) {
    try {
      log(!!this.#__options?.debug, {
        message,
        options: this.#__options,
        block: dump(this.#__lastBlock),
        cell: dump(this.#__lastCell),
        ...(this.#__options.verbose ? { blocks: dump(this.#__blocks)?.replace(/\n/g, '') } : {}),
      });
    } catch (error) {
      raise("Failed to serialize `EmptyBlockBuilder`'s logger payload", error);
    }
  }
}

export class BlocksBuilder<TCell extends Cell> {
  #__options: BlocksOptions;
  #__blocks: Array<Array<Cell>> = [];

  get #__lastBlockIndex() {
    return this.#__blocks?.length - 1;
  }

  get #__lastBlock(): Array<Cell> | undefined {
    return this.#__blocks[this.#__lastBlockIndex];
  }

  set #__lastBlock(block: Array<Cell>) {
    this.#__blocks[this.#__lastBlockIndex] = block;
  }

  constructor(options: BlocksOptions) {
    this.#__options = options;

    this.#__logger('Created an instance of `BlocksBuilder`');
  }

  addBlock() {
    this.#__blocks.push([] as any);

    this.#__logger('Added first block.');

    return new EmptyBlockBuilder<TCell>(this.#__blocks, this.#__options);
  }

  addCell() {
    return raise('Attempted to call `addCell` before calling `addBlock`');
  }

  build() {
    return raise('Attempted to call `build` before calling `addBlock`');
  }

  #__logger(message: string) {
    try {
      log(!!this.#__options?.debug, {
        message,
        options: this.#__options,
        block: dump(this.#__lastBlock),
        cell: undefined,
        ...(this.#__options.verbose ? { blocks: dump(this.#__blocks) } : {}),
      });
    } catch (error) {
      raise("Failed to serialize `BlocksBuilder`'s logger payload", error);
    }
  }
}

export const createBlocks = <TCellType extends Cell | InvalidCellMessage = InvalidCellMessage>(
  options: BlocksOptions = {},
) =>
  new BlocksBuilder<// @ts-expect-error - A generic should always be provided.
  TCellType>(options);
