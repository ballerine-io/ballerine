import { useSearchParams } from 'react-router-dom';

export const useFilterId = (): string | undefined => {
  const [params] = useSearchParams();

  return params.get('filterId');
};
