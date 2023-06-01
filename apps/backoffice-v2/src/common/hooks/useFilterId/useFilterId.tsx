import { useSearch } from '@tanstack/react-router';

export const useFilterId = (): string | undefined =>
  useSearch({
    strict: false,
    track: ({ filterId }) => filterId,
  })?.filterId;
