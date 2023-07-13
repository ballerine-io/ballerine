import { Block, Cell } from '@/types';

export class BlockBuilder<TLastBlock extends Array<TCell>, TCell extends Cell> {
  #__blocks: Array<Block<Array<TCell>>>;

  constructor(blocks: Array<Block<Array<TCell>>>) {
    this.#__blocks = blocks;
  }

  addCell(cell: TCell): BlockBuilder<[...TLastBlock, TCell], TCell> {
    this.#__blocks[this.#__blocks.length - 1]!.push(cell);

    return this as unknown as BlockBuilder<[...TLastBlock, TCell], TCell>;
  }

  build(): Array<Block<Array<TCell>>> {
    return this.#__blocks;
  }
}

export class EmptyBlockBuilder<TLastBlock extends Array<TCell>, TCell extends Cell> {
  #__blocks: Array<Block<Array<TCell>>>;

  constructor(blocks: Array<Block<Array<TCell>>>) {
    this.#__blocks = blocks;
  }

  addCell(cell: TCell): BlockBuilder<[...TLastBlock, TCell], TCell> {
    this.#__blocks[this.#__blocks.length - 1]!.push(cell);

    return new BlockBuilder(this.#__blocks) as unknown as BlockBuilder<
      [...TLastBlock, TCell],
      TCell
    >;
  }
}

export class BlocksBuilder<TCellType extends Cell> {
  #__blocks: Array<Block<Array<TCellType>>> = [];

  addBlock<TBlock extends Array<TCellType> = []>() {
    this.#__blocks.push([]);

    return new EmptyBlockBuilder(this.#__blocks) as unknown as EmptyBlockBuilder<TBlock, TCellType>;
  }
}

export const createBlocks = <
  // @ts-expect-error - A generic should always be provided.
  TCellType extends Cell = "Please provide a union of available cell types discriminated by '{ type: string; }'",
>() => new BlocksBuilder<TCellType>();
