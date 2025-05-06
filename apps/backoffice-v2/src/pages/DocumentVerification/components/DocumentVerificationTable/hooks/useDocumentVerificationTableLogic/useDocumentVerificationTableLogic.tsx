import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TDocumentVerificationCheck } from '@/domains/document-verification/fetchers';

export const useDocumentVerificationTableLogic = () => {
  const locale = useLocale();

  const Cell: IDataTableProps<TDocumentVerificationCheck>['CellContentWrapper'] = ({
    cell,
    children,
  }) => {
    const row = cell.row.original;
    return <Link to={`/${locale}/document-verification/${row.checkId}`}>{children}</Link>;
  };

  return { Cell };
};
