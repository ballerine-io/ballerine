export interface IFilterItemProps {
  onFilter: (accessor: string) => (value: string[]) => void;
  title: string;
  accessor: string;
  options: Array<{ label: string; value: string | null }>;
}
