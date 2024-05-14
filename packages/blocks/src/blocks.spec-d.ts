import { describe, expectTypeOf, it } from 'vitest';
import { BlocksBuilder, createBlocks } from '@/blocks';

type TCell =
  | {
      type: 'heading';
      value: string;
    }
  | {
      type: 'headings';
      value: string[];
    };

const createTestBlocks = () =>
  createBlocks<TCell>({
    debug: !process.env.CI,
    verbose: true,
  });

/**
 * @description Provides an easy way of identifying a cell.
 * @param block
 * @param cell
 */
const generateCellValue = <TBlock extends number, TCell extends number>({
  block,
  cell,
}: {
  block: TBlock;
  cell: TCell;
}) => `block:${block}:cell:${cell}` as const;

describe('blocks #types', () => {
  describe('when adding a block', () => {
    it('should infer an empty block', () => {
      // Arrange
      const blocks = createTestBlocks().addBlock();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<BlocksBuilder<TCell, []>>();
    });
  });

  describe('when adding a cell', () => {
    it('should infer a block with a cell', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blocks = createTestBlocks().addBlock().addCell({
        type: 'heading',
        value: blockOneCellOne,
      });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: typeof blockOneCellOne }],
          [[{ type: 'heading'; value: typeof blockOneCellOne }]]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [[{ type: 'heading'; value: typeof blockOneCellOne }]]
      >();
    });
  });

  describe('when adding multiple blocks', () => {
    it('should infer multiple blocks with a cell', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockTwoCellOne = [
        generateCellValue({
          block: 2,
          cell: 1,
        }),
      ];
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [{ type: 'heading'; value: typeof blockOneCellOne }],
          [
            [{ type: 'heading'; value: typeof blockOneCellOne }],
            [{ type: 'headings'; value: typeof blockTwoCellOne }],
          ]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [
          [{ type: 'heading'; value: typeof blockOneCellOne }],
          [{ type: 'headings'; value: typeof blockTwoCellOne }],
        ]
      >();
    });
  });

  describe('when adding multiple cells', () => {
    it('should infer a block with multiple cells', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockOneCellTwo = [
        generateCellValue({
          block: 1,
          cell: 2,
        }),
      ];
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [
            { type: 'heading'; value: typeof blockOneCellOne },
            { type: 'headings'; value: typeof blockOneCellTwo },
          ],
          [
            [
              { type: 'heading'; value: typeof blockOneCellOne },
              { type: 'headings'; value: typeof blockOneCellTwo },
            ],
          ]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [
          [
            { type: 'heading'; value: typeof blockOneCellOne },
            { type: 'headings'; value: typeof blockOneCellTwo },
          ],
        ]
      >();
    });
  });

  describe('when adding multiple blocks and multiple cells', () => {
    it('should infer multiple blocks with multiple cells', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockOneCellTwo = [
        generateCellValue({
          block: 1,
          cell: 2,
        }),
      ];
      const blockTwoCellOne = [
        generateCellValue({
          block: 2,
          cell: 1,
        }),
      ];
      const blockTwoCellTwo = generateCellValue({
        block: 2,
        cell: 2,
      });
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .addCell({ type: 'heading', value: blockTwoCellTwo });

      // Act
      const builtBlocks = blocks.build();

      // Assert
      expectTypeOf<typeof blocks>().toEqualTypeOf<
        BlocksBuilder<
          TCell,
          [
            { type: 'heading'; value: typeof blockOneCellOne },
            { type: 'headings'; value: typeof blockOneCellTwo },
          ],
          [
            [
              { type: 'heading'; value: typeof blockOneCellOne },
              { type: 'headings'; value: typeof blockOneCellTwo },
            ],
            [
              { type: 'headings'; value: typeof blockTwoCellOne },
              { type: 'heading'; value: typeof blockTwoCellTwo },
            ],
          ]
        >
      >();
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [
          [
            { type: 'heading'; value: typeof blockOneCellOne },
            { type: 'headings'; value: typeof blockOneCellTwo },
          ],
          [
            { type: 'headings'; value: typeof blockTwoCellOne },
            { type: 'heading'; value: typeof blockTwoCellTwo },
          ],
        ]
      >();
    });
  });

  describe('when calling `blockAt`', () => {
    it('should infer the block at the specified index', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockOneCellTwo = [
        generateCellValue({
          block: 1,
          cell: 2,
        }),
      ];
      const blockTwoCellOne = [
        generateCellValue({
          block: 2,
          cell: 1,
        }),
      ];
      const blockTwoCellTwo = generateCellValue({
        block: 2,
        cell: 2,
      });
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .addCell({ type: 'heading', value: blockTwoCellTwo });

      // Act
      const block = blocks.blockAt(0);

      // Assert
      expectTypeOf<typeof block>().toEqualTypeOf<
        [
          { type: 'heading'; value: typeof blockOneCellOne },
          { type: 'headings'; value: typeof blockOneCellTwo },
        ]
      >();
    });
  });

  describe('when calling `cellAt`', () => {
    it('should infer the cell at the specified index', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockOneCellTwo = [
        generateCellValue({
          block: 1,
          cell: 2,
        }),
      ];
      const blockTwoCellOne = [
        generateCellValue({
          block: 2,
          cell: 1,
        }),
      ];
      const blockTwoCellTwo = generateCellValue({
        block: 2,
        cell: 2,
      });
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .addCell({ type: 'heading', value: blockTwoCellTwo });

      // Act
      const cell = blocks.cellAt(0, 0);

      // Assert
      expectTypeOf<typeof cell>().toEqualTypeOf<{
        type: 'heading';
        value: typeof blockOneCellOne;
      }>();
    });
  });

  describe('when calling `buildFlat`', () => {
    it('should infer an array of cells with a depth of `1`', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({
        block: 1,
        cell: 1,
      });
      const blockOneCellTwo = [
        generateCellValue({
          block: 1,
          cell: 2,
        }),
      ];
      const blockTwoCellOne = [
        generateCellValue({
          block: 2,
          cell: 1,
        }),
      ];
      const blockTwoCellTwo = generateCellValue({
        block: 2,
        cell: 2,
      });
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .addCell({ type: 'heading', value: blockTwoCellTwo });

      // Act
      const builtBlocks = blocks.buildFlat();

      // Assert
      expectTypeOf<typeof builtBlocks>().toEqualTypeOf<
        [
          { type: 'heading'; value: typeof blockOneCellOne },
          { type: 'headings'; value: typeof blockOneCellTwo },
          { type: 'headings'; value: typeof blockTwoCellOne },
          { type: 'heading'; value: typeof blockTwoCellTwo },
        ]
      >();
    });
  });
});
