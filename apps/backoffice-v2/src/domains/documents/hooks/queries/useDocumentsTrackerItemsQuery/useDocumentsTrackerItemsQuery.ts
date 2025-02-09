import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { titleCase } from 'string-ts';
import { documentsQueryKey } from '@/domains/documents/hooks/query-keys';

export const useDocumentsTrackerItemsQuery = ({
  workflowDefinitionId,
  workflowRuntimeDataId,
}: {
  workflowDefinitionId: string;
  workflowRuntimeDataId: string;
}) => {
  const isAuthenticated = useIsAuthenticated();
  const { search, pathname } = useLocation();

  return useQuery({
    ...documentsQueryKey.trackerItems({ workflowDefinitionId, workflowRuntimeDataId }),
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
