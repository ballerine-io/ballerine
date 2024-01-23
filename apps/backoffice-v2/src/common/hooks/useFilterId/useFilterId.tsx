import { useSearchParams } from 'react-router-dom';

export const useFilterId = () => {
  const [params] = useSearchParams();

  return params.get('filterId');
};
