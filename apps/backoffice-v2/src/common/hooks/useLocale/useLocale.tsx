import { useParams } from 'react-router-dom';

export const useLocale = () => {
  const { locale } = useParams();

  return locale;
};
