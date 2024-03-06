import { APP_LANGUAGE_QUERY_KEY } from '@/common/consts/consts';
import { useSearchParams } from 'react-router-dom';

const defaultQuery = {
  lng: 'en',
};

export const useLanguage = () => {
  const [location] = useSearchParams(defaultQuery);

  return location.get(APP_LANGUAGE_QUERY_KEY) || defaultQuery.lng;
};
