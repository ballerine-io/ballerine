import { describe, expect, it } from 'vitest';
import { createBlocks } from '@/blocks';

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

describe('blocks #integration', () => {
  describe('when creating an instance of `createBlocks`', () => {
    it('should throw an error when calling `build` with no blocks', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const blocksBuild = blocksBuilder.build;

      // Assert
      expect(blocksBuild).toThrow('Attempted to call `build` before calling `addBlock`.');
    });

    it('should throw an error when calling `addCell` with no blocks', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const blocksAddCell = blocksBuilder.addCell;

      // Assert
      expect(blocksAddCell).toThrow('Attempted to call `addCell` before calling `addBlock`');
    });
  });

  describe('when a block is added', () => {
    it('should throw an error when calling `addBlock` consecutively', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const blocksAddBlockConsecutively = blocksBuilder.addBlock().addBlock;

      // Assert
      expect(blocksAddBlockConsecutively).toThrow(
        'Attempted to call `addBlock` before calling `addCell`.',
      );
    });

    it('should throw an error when calling `build` with no cells', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const blocksBuild = blocksBuilder.addBlock().build;

      // Assert
      expect(blocksBuild).toThrow('Attempted to call `build` before calling `addCell`.');
    });

    it('should add a single block when calling `addBlock`', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocks = blocksBuilder.addBlock();
      const blocksCount = blocks.blocksCount;

      // Assert
      expect(blocksCount).toBe(1);
    });

    it('should not add a cell when calling `addBlock`', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocks = blocksBuilder.addBlock();
      const firstBlock = blocks.blockAt(0);
      const cellsCount = blocks.cellsCount(0);

      // Assert
      expect(firstBlock).toEqual([]);
      expect(cellsCount).toBe(0);
    });
  });

  describe('when a cell is added', () => {
    it('should return a single block with a single cell when calling `build`', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();
      const cellOne = generateCellValue({ block: 1, cell: 1 });

      // Act
      const blocks = blocksBuilder.addBlock().addCell({ type: 'heading', value: cellOne }).build();

      // Assert
      expect(blocks).toEqual([[{ type: 'heading', value: cellOne }]]);
    });

    it('should return a single block with multiple cells when calling `build`', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();
      const cellOne = generateCellValue({ block: 1, cell: 1 });
      const cellTwo = [generateCellValue({ block: 1, cell: 2 })];

      // Act
      const blocks = blocksBuilder
        .addBlock()
        .addCell({ type: 'heading', value: cellOne })
        .addCell({ type: 'headings', value: cellTwo })
        .build();

      // Assert
      expect(blocks).toEqual([
        [
          { type: 'heading', value: cellOne },
          { type: 'headings', value: cellTwo },
        ],
      ]);
    });
  });

  describe('when multiple blocks are added', () => {
    it('should return multiple blocks with a single cell when calling `build`', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockTwoCellOne = [generateCellValue({ block: 2, cell: 1 })];

      // Act
      const blocks = blocksBuilder
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .build();

      // Assert
      expect(blocks).toEqual([
        [{ type: 'heading', value: blockOneCellOne }],
        [{ type: 'headings', value: blockTwoCellOne }],
      ]);
    });

    it('should always add the last cell to the last block', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockOneCellTwo = [generateCellValue({ block: 1, cell: 2 })];
      const blockTwoCellOne = generateCellValue({ block: 2, cell: 1 });
      const blockTwoCellTwo = [generateCellValue({ block: 2, cell: 2 })];
      const blockThreeCellOne = generateCellValue({ block: 3, cell: 1 });
      const blockThreeCellTwo = [generateCellValue({ block: 3, cell: 2 })];

      // Act
      const blocks = blocksBuilder
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'heading', value: blockTwoCellOne })
        .addCell({ type: 'headings', value: blockTwoCellTwo })
        .addBlock()
        .addCell({ type: 'heading', value: blockThreeCellOne })
        .addCell({ type: 'headings', value: blockThreeCellTwo })
        .build();
      const firstBlock = blocks[0];
      const lastBlock = blocks[blocks.length - 1];

      // Assert
      expect(firstBlock).toEqual([
        { type: 'heading', value: blockOneCellOne },
        { type: 'headings', value: blockOneCellTwo },
      ]);
      expect(lastBlock).toEqual([
        { type: 'heading', value: blockThreeCellOne },
        { type: 'headings', value: blockThreeCellTwo },
      ]);
    });
  });

  describe('when accessing `blocksCount`', () => {
    it('should return 0 when no blocks have been added', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocksCount = blocksBuilder.blocksCount;

      // Assert
      expect(blocksCount).toBe(0);
    });

    it('should return 1 when a single block has been added', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocksCount = blocksBuilder.addBlock().blocksCount;

      // Assert
      expect(blocksCount).toBe(1);
    });

    it('should not change when a cell is added', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocksCount = blocksBuilder
        .addBlock()
        .addCell({ type: 'heading', value: 'test' }).blocksCount;

      // Assert
      expect(blocksCount).toBe(1);
    });
  });

  describe('when calling `cellsCount`', () => {
    it('should return 0 when no cells have been added', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const cellsCount = blocksBuilder.cellsCount(0);

      // Assert
      expect(cellsCount).toBe(0);
    });

    it('should increment when adding cells', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blockWithOneCell = blocksBuilder.addBlock().addCell({ type: 'heading', value: 'test' });
      const blockWithOneCellCount = blockWithOneCell.cellsCount(0);
      const blockWithTwoCells = blockWithOneCell.addCell({ type: 'heading', value: 'test' });
      const blockWithTwoCellsCount = blockWithTwoCells.cellsCount(0);

      // Assert
      expect(blockWithOneCellCount).toBe(1);
      expect(blockWithTwoCellsCount).toBe(2);
    });

    it('should not return a cells count belonging to another block', () => {
      // Arrange
      const blocksBuilder = createTestBlocks();

      // Act
      const blocksWithOneBlock = blocksBuilder
        .addBlock()
        .addCell({ type: 'heading', value: 'test' });
      const blocksWithOneBlockCount = blocksWithOneBlock.cellsCount(0);
      const blocksWithTwoBlocks = blocksWithOneBlock.addBlock();
      const blocksWithTwoBlocksCount = blocksWithTwoBlocks.cellsCount(1);

      // Assert
      expect(blocksWithOneBlockCount).toBe(1);
      expect(blocksWithTwoBlocksCount).toBe(0);
    });
  });

  describe('when calling `blockAt`', () => {
    it('should return the block at the given index', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockTwoCellOne = [generateCellValue({ block: 2, cell: 1 })];
      const blocksBuilder = createTestBlocks()
        .addBlock()
        .addCell({
          type: 'heading',
          value: blockOneCellOne,
        })
        .addBlock()
        .addCell({
          type: 'headings',
          value: blockTwoCellOne,
        });

      // Act
      const firstBlock = blocksBuilder.blockAt(0);
      const secondBlock = blocksBuilder.blockAt(1);

      // Assert
      expect(firstBlock).toEqual([{ type: 'heading', value: blockOneCellOne }]);
      expect(secondBlock).toEqual([{ type: 'headings', value: blockTwoCellOne }]);
    });
  });

  describe('when calling `cellAt`', () => {
    it('should return the cell at the given index', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockTwoCellOne = [generateCellValue({ block: 2, cell: 1 })];
      const blocksBuilder = createTestBlocks()
        .addBlock()
        .addCell({
          type: 'heading',
          value: blockOneCellOne,
        })
        .addBlock()
        .addCell({
          type: 'headings',
          value: blockTwoCellOne,
        });

      // Act
      const firstCell = blocksBuilder.cellAt(0, 0);
      const secondCell = blocksBuilder.cellAt(1, 0);

      // Assert
      expect(firstCell).toEqual({ type: 'heading', value: blockOneCellOne });
      expect(secondCell).toEqual({ type: 'headings', value: blockTwoCellOne });
    });
  });

  describe('when calling `buildFlat`', () => {
    it('should return an array of blocks with a depth of `1`', () => {
      // Arrange
      const blockOneCellOne = generateCellValue({ block: 1, cell: 1 });
      const blockOneCellTwo = [generateCellValue({ block: 1, cell: 2 })];
      const blockTwoCellOne = [generateCellValue({ block: 2, cell: 1 })];
      const blockTwoCellTwo = generateCellValue({ block: 2, cell: 2 });
      const blocks = createTestBlocks()
        .addBlock()
        .addCell({ type: 'heading', value: blockOneCellOne })
        .addCell({ type: 'headings', value: blockOneCellTwo })
        .addBlock()
        .addCell({ type: 'headings', value: blockTwoCellOne })
        .addCell({ type: 'heading', value: blockTwoCellTwo })
        .buildFlat();

      // Assert
      expect(blocks).toEqual([
        { type: 'heading', value: blockOneCellOne },
        { type: 'headings', value: blockOneCellTwo },
        { type: 'headings', value: blockTwoCellOne },
        { type: 'heading', value: blockTwoCellTwo },
      ]);
    });
  });
});
