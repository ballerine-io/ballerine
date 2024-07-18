import { GetFiltersListDto, GetFiltersResponse } from '@/domains/filters/filters.types';
import { request } from '@/lib/request';

export const fetchFiltersList = async (query: GetFiltersListDto) => {
  const result = await request.get<GetFiltersResponse>('/external/filters', {
    params: query,
  });

  return result.data;
};
