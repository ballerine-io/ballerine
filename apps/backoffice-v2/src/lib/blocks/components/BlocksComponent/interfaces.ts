import { cells } from '@/pages/Entity/hooks/useEntity/cells';

export interface IBlocksComponentProps {
  blocks: Array<{
    className?: string;
    cells: Array<{
      type: keyof typeof cells;
      value: unknown;
    }>;
  }>;
}
