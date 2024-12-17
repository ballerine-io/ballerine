export interface IFilter {
  id: string;
  name: string;
  entity: string;
  query: object;
  createdAt: string;
  projectId: string;
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
export interface CreateFilterDto {
  name: string;
  entity: string;
  query: {
    where: {
      businessId: {
        not: null;
      };
      workflowDefinitionId: {
        in: string[];
      };
    };
    select: object;
  };
  projectId: string;
}
