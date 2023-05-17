import { useSearch } from '@tanstack/react-router';

export const useFilterEntity = () =>
  useSearch({
    strict: false,
    track: ({ entity }) => entity,
  })?.entity;
