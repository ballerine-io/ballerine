import { useSearch } from '@tanstack/react-router';

export const useFilterEntity = (): string | undefined =>
  useSearch({
    strict: false,
    track: ({ entity }) => entity,
  })?.entity;
