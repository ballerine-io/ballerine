import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';

export const useFilterEntity = (): string | undefined => {
  const [{ entity }] = useSearchParamsByEntity();

  return entity;
};
