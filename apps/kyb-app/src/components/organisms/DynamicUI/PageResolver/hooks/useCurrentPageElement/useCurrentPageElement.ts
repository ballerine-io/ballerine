import { UIPage } from '@/domains/collection-flow';
import { useMemo } from 'react';

export const useCurrentPageElement = (state: string, pages: UIPage[]) => {
  const currentPage = useMemo(
    () => pages.find(page => page.stateName === state) || null,
    [state, pages],
  );

  return currentPage;
};
