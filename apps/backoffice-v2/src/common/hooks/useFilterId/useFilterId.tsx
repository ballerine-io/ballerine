import { useSearchParams } from 'react-router-dom';

export const useFilterId = (): string | undefined => {
  const [params] = useSearchParams();
  const filterId = params.get('filterId');

  return filterId;
};
