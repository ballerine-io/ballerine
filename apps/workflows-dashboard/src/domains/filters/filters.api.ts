import {
  CreateFilterDto,
  GetFiltersListDto,
  GetFiltersResponse,
} from '@/domains/filters/filters.types';
import { request } from '@/lib/request';

export const fetchFiltersList = async (query: GetFiltersListDto) => {
  const result = await request.get<GetFiltersResponse>('/external/filters', {
    params: query,
  });

  return result.data;
};

export const createFilter = async (dto: CreateFilterDto) => {
  const result = await request.post('/external/filters', dto);

  return result.data;
};
