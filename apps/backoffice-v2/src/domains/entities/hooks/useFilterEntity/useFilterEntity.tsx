import { useSearchParams } from 'react-router-dom';

export const useFilterEntity = (): string | undefined => {
  const [searchParams] = useSearchParams();

  return searchParams.get('entity');
};
