export interface IPaginationProps {
  page: number;
  onPaginate: (page: number) => () => void;
  pages: Array<number>;
  totalPages: number;
}
