import type { Column } from '@pankod/refine-react-table';

export interface ICategory {
  id: number;
  title: string;
}
export interface IPost {
  id: number;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'rejected';
  createdAt: string;
  category: { id: number };
}

export interface ColumnButtonProps {
  column: Column<any, any>;
}

export interface FilterElementProps {
  value: any;
  onChange: (value: any) => void;
}
