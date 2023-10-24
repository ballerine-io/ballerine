import { Navigate, NavigateProps, useLocation } from 'react-router-dom';

interface Props extends NavigateProps {
  preserveQuery?: boolean;
}

export const AppNavigate = ({ to, preserveQuery = true, ...navigateProps }: Props) => {
  const location = useLocation();

  return (
    <Navigate
      {...navigateProps}
      to={preserveQuery && typeof to === 'string' ? { pathname: to, search: location.search } : to}
    />
  );
};
