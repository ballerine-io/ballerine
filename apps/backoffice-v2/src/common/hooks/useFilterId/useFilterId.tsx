import { useSearchParams } from 'react-router-dom';

export const useFilterId = (): string | null => {
  const [params] = useSearchParams();

  return params.get('filterId');
};
