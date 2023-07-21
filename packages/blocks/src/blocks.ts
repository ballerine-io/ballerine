import { Cell, InferAllButLastArrayElements, InferLastArrayElement } from '@/types';
import { raise } from '@ballerine/common';

export class BlockBuilder<
  TCell extends Cell,
  TLastBlock extends Array<Cell> = [],
  TBlocks extends Array<Array<Cell>> = [],
> {
  #__blocks: TBlocks;

  constructor(blocks: TBlocks) {
    this.#__blocks = blocks;
  }

  addBlock() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.#__blocks.push([] as any);

    return this as BlockBuilder<TCell, [], TBlocks>;
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    this.#__blocks[this.#__blocks.length - 1]!.push(cell);

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
}

export class EmptyBlockBuilder<TCell extends Cell, TLastBlock extends Array<Cell> = []> {
  #__blocks: Array<Array<Cell>> = [];

  constructor(block: Array<Cell>) {
    this.#__blocks.push(block);
  }

  addCell<TCellType extends TCell>(cell: TCellType) {
    this.#__blocks[this.#__blocks.length - 1]!.push(cell);

    return new BlockBuilder(this.#__blocks) as BlockBuilder<
      TCell,
      [...TLastBlock, TCellType],
      [[...TLastBlock, TCellType]]
    >;
  }

  addBlock() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return raise('Attempted to call `addBlock` before calling `addCell`');
  }

  build() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return raise('Attempted to call `build` before calling `addCell`');
  }
}

export class BlocksBuilder<TCell extends Cell> {
  addBlock() {
    return new EmptyBlockBuilder<TCell>([]);
  }

  addCell() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return raise('Attempted to call `addCell` before calling `addBlock`');
  }

  build() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return raise('Attempted to call `build` before calling `addBlock`');
  }
}

export type InvalidCellMessage =
  "Please provide a union of available cell types discriminated by '{ type: string; }'";

export const createBlocks = <TCellType extends Cell | InvalidCellMessage = InvalidCellMessage>() =>
  new BlocksBuilder<// @ts-expect-error - A generic should always be provided.
  TCellType>();
