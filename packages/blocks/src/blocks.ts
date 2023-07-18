import { Cell, InferAllButLastArrayElements, InferLastArrayElement } from '@/types';

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
}

export class BlocksBuilder<TCell extends Cell> {
  addBlock() {
    return new EmptyBlockBuilder<TCell>([]);
  }
}

export const createBlocks = <
  // @ts-expect-error - A generic should always be provided.
  TCellType extends Cell = "Please provide a union of available cell types discriminated by '{ type: string; }'",
>() => new BlocksBuilder<TCellType>();
