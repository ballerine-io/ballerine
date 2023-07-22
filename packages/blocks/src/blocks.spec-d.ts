import { describe, expectTypeOf, it } from 'vitest';
import { BlocksBuilder, createBlocks } from '@/blocks';
import { Blocks } from '@/types';

type TCell =
  | {
      type: 'heading';
      value: string;
    }
  | {
      type: 'headings';
      value: Array<string>;
    };

const createTestBlocks = <TInitialBlocks extends Blocks = []>(initialBlocks?: TInitialBlocks) =>
  createBlocks<TCell>()({
    debug: true,
    verbose: true,
    initialBlocks,
  });

/**
 * @description Provides an easy way of identifying a cell.
 * @param block
 * @param cell
 */
const generateCellValue = ({ block, cell }: { block: number; cell: number }) =>
  `block:${block}:cell:${cell}`;

describe('blocks #types', () => {
  describe('when adding a block', () => {
    it('should infer an empty block', () => {
      // Arrange
      const blocks = createTestBlocks().addBlock();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<BlocksBuilder<TCell, [], []>>();
    });
  });

  describe('when passing `initialBlocks` into `createBlocks`', () => {
    it.todo('should infer the initial blocks', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 }) as `block:1:cell:1`;
      const blocks = createBlocks<TCell>()({
        initialBlocks: [
          [{ type: 'heading', value: blockOneCellOne }],
          [{ type: 'heading', value: blockOneCellOne }],
          [{ type: 'headings', value: blockOneCellOne }],
        ],
      });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }],
          [[{ type: 'heading'; value: string }]],
          [[{ type: 'heading'; value: string }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<[[{ type: 'heading'; value: string }]]>();
    });
  });

  describe('when calling `addBlocks`', () => {
    it.todo('should infer the old blocks', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockTwoCellOne = generateCellValue({ block: 2, cell: 1 });
      const blocks = createBlocks<TCell>()()
        .addCell({
          type: 'heading',
          value: blockOneCellOne,
        })
        .addBlocks([
          [{ type: 'heading', value: blockTwoCellOne }],
          [{ type: 'headings', value: blockTwoCellOne }],
        ]);

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }],
          [[{ type: 'heading'; value: string }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<[[{ type: 'heading'; value: string }]]>();
    });

    it.todo('should infer the new blocks', () => {
      // Arrange
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({
          type: 'heading',
          value: 'Hello',
        })
        .addBlocks([[{ type: 'heading', value: 'Hello' }]]);

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }],
          [[{ type: 'heading'; value: string }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<[[{ type: 'heading'; value: string }]]>();
    });
  });

  describe('when adding a cell', () => {
    it('should infer a block with a cell', () => {
      // Arrange
      const blocks = createTestBlocks().addBlock().addCell({ type: 'heading', value: 'Hello' });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }],
          [[{ type: 'heading'; value: string }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<[[{ type: 'heading'; value: string }]]>();
    });
  });

  describe('when adding multiple blocks', () => {
    it('should infer multiple blocks with a cell', () => {
      // Arrange
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: 'Hello' })
        .addBlock()
        .addCell({ type: 'headings', value: ['Hello1'] });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }],
          [[{ type: 'heading'; value: string }], [{ type: 'headings'; value: string[] }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [[{ type: 'heading'; value: string }], [{ type: 'headings'; value: string[] }]]
      >();
    });
  });

  describe('when adding multiple cells', () => {
    it('should infer a block with multiple cells', () => {
      // Arrange
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: 'Hello' })
        .addCell({ type: 'headings', value: ['Hello'] });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }],
          [[{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [[{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }]]
      >();
    });
  });

  describe('when adding multiple blocks and multiple cells', () => {
    it('should infer multiple blocks with multiple cells', () => {
      // Arrange
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: 'Hello' })
        .addCell({ type: 'headings', value: ['Hello'] })
        .addBlock()
        .addCell({ type: 'headings', value: ['Hello'] })
        .addCell({ type: 'heading', value: 'Hello' });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }],
          [
            [{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }],
            [{ type: 'headings'; value: string[] }, { type: 'heading'; value: string }],
          ]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [
          [{ type: 'heading'; value: string }, { type: 'headings'; value: string[] }],
          [{ type: 'headings'; value: string[] }, { type: 'heading'; value: string }],
        ]
      >();
    });
  });
});
