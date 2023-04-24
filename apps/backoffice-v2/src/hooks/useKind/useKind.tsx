import { useSearch } from '@tanstack/react-router';

export const useKind = () =>
  useSearch({
    track: ({ kind }) => kind,
  })?.kind;
