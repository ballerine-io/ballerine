import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { titleCase } from 'string-ts';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';

export const useDocumentsTrackerItemsQuery = ({ workflowId }: { workflowId: string }) => {
  const isAuthenticated = useIsAuthenticated();
  const { search, pathname } = useLocation();

  return useQuery({
    ...documentsQueryKeys.trackerItems({ workflowId }),
    enabled: isAuthenticated,
    select: data => {
      return {
        business: data?.business.map(item => ({
          ...item,
          url: `${pathname}?${search}#${titleCase(item?.category)} - ${titleCase(item.type)}`,
        })),
        individuals: {
          ubos: data?.individuals.ubos.map(item => ({
            ...item,
            url: `${pathname}?${search}#${titleCase(item?.category)} - ${titleCase(item?.type)}`,
          })),
          directors: data?.individuals.directors.map(item => ({
            ...item,
            url: `${pathname}?${search}#${titleCase(item?.category)} - ${titleCase(item?.type)}`,
          })),
        },
      };
    },
  });
};
