import { cells } from '@/lib/blocks/cells';

export interface IBlocksComponentProps {
  blocks: Array<{
    className?: string;
    cells: Array<{
      type: keyof typeof cells;
      value: unknown;
    }>;
  }>;
}
