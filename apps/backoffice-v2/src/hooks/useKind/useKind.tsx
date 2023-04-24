import { useSearch } from '@tanstack/react-router';

export const useKind = () =>
  useSearch({
    strict: false,
    track: ({ kind }) => kind,
  })?.kind;
