import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchIndividualsProfiles } from './fetchers';

export const individualsProfilesQueryKeys = createQueryKeys('individuals-profiles', {
  list: ({ sortBy, sortDir, page, pageSize, ...params }) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
      page: {
        number: Number(page),
        size: Number(pageSize),
      },
    };

    return {
      queryKey: [
        {
          ...params,
          sortBy,
          sortDir,
          page,
          pageSize,
        },
      ],
      queryFn: () => fetchIndividualsProfiles(data),
    };
  },
});
