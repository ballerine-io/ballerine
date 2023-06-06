import { useSearchParamsByEntity } from '../useSearchParamsByEntity/useSearchParamsByEntity';

export const useFilterId = (): string | undefined => {
  const [{ filterId }] = useSearchParamsByEntity();

  return filterId;
};
