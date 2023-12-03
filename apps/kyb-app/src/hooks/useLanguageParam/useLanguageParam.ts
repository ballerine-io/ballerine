import { useSearchParams } from 'react-router-dom';

export const useLanguageParam = () => {
  const [params] = useSearchParams();

  return params.get('lng');
};
