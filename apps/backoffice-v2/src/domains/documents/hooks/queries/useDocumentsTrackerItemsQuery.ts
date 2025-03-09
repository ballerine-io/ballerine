import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { titleCase } from 'string-ts';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';
import { useCallback } from 'react';

export const useDocumentsTrackerItemsQuery = ({ workflowId }: { workflowId: string }) => {
  const isAuthenticated = useIsAuthenticated();
  const { search, pathname } = useLocation();
  const generateUrlToDocument = useCallback(
    ({
      tab,
      search,
      category,
      type,
    }: {
      tab: string;
      search: string;
      category: string;
      type: string;
    }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeTab', tab);

      return `${pathname}${searchParams.toString()}#${titleCase(category ?? '')} - ${titleCase(
        type ?? '',
      )}`;
    },
    [pathname],
  );

  return useQuery({
    ...documentsQueryKeys.trackerItems({ workflowId }),
    enabled: isAuthenticated && !!workflowId,
    select: data => {
      return {
        business: data?.business.map(item => ({
          ...item,
          url: generateUrlToDocument({
            tab: 'documents',
            search,
            category: item?.identifiers?.document?.category,
            type: item?.identifiers?.document?.type,
          }),
        })),
        individuals: {
          ubos: data?.individuals.ubos.map(item => ({
            ...item,
            url: generateUrlToDocument({
              tab: 'ubosKyc',
              search,
              category: item?.identifiers?.document?.category,
              type: item?.identifiers?.document?.type,
            }),
          })),
          directors: data?.individuals.directors.map(item => ({
            ...item,
            url: generateUrlToDocument({
              tab: 'directors',
              search,
              category: item?.identifiers?.document?.category,
              type: item?.identifiers?.document?.type,
            }),
          })),
        },
      };
    },
  });
};
