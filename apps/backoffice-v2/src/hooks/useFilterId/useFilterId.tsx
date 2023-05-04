import { useSearch } from '@tanstack/react-router';

export const useFilterId = () =>
  useSearch({
    strict: false,
    track: ({ filterId }) => filterId,
  })?.filterId;
