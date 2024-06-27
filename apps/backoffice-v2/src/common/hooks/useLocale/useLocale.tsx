import { useParams } from 'react-router-dom';

export const useLocale = (defaultLocale = 'en') => {
  const { locale } = useParams();

  return locale || defaultLocale;
};
