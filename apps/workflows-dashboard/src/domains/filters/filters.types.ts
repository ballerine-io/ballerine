export interface IFilter {
  id: string;
  name: string;
  entity: string;
  query: object;
  createdAt: string;
}

export interface GetFiltersListDto {
  page: number;
  limit: number;
}

export interface GetFiltersResponse {
  items: IFilter[];
  meta: {
    total: number;
    pages: number;
  };
}
