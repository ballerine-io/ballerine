export interface IMapCellProps {
  value:
    | string
    | {
        city: string;
        country: string;
        street: string;
      };
}
