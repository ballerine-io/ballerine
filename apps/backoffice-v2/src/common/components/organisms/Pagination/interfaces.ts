export interface IPaginationProps {
  page: number;
  onPaginate: (page: number) => () => void;
  totalPages: number;
}
