import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { selectDirectors } from '@/pages/Entity/selectors/selectDirectors';
import { TDocument } from '@ballerine/common';
import { useCallback, useMemo } from 'react';

export type TEntitiesDocumentsFilter = 'all' | 'directors' | 'ubos';

const allOrExact = (filter: TEntitiesDocumentsFilter, exact: TEntitiesDocumentsFilter) =>
  filter === 'all' || filter === exact;

export const useEntitiesDocuments = (
  workflow?: TWorkflowById,
  filter: 'all' | 'directors' | 'ubos' = 'all',
) => {
  const directors = useMemo(
    () => (allOrExact(filter, 'directors') ? selectDirectors(workflow) || [] : []),
    [workflow, filter],
  );
  const ubos = useMemo(
    () => (allOrExact(filter, 'ubos') ? workflow?.childWorkflows || [] : []),
    [workflow, filter],
  );

  const entityIds = useMemo(
    () =>
      [
        ...directors.map(director => director.ballerineEntityId),
        ...ubos.map(ubo => ubo.entity.id),
        filter === 'all' ? workflow?.context?.entity?.ballerineEntityId : undefined,
      ]
        .filter(Boolean)
        .flat(),
    [directors, ubos, workflow, filter],
  );
  const contextDocuments = useMemo(() => workflow?.context?.documents || [], [workflow]);

  const { documents, documentsSchemas, isLoading } = useDocumentsAdapter({
    entityIds,
    documents: contextDocuments as TDocument[],
  });

  const getDocumentEntityType = useCallback(
    (document: TDocument) => {
      if (document.businessId === workflow?.context?.entity?.ballerineEntityId) {
        return 'business';
      }

      if (directors.some(director => director.ballerineEntityId === document.endUserId)) {
        return 'director';
      }

      if (ubos.some(ubo => ubo.entity.id === document.endUserId)) {
        return 'ubo';
      }

      return document.type;
    },
    [directors, ubos, workflow?.context?.entity?.ballerineEntityId],
  );

  const getDocumentEntity = useCallback(
    (document: TDocument) => {
      if (document.businessId === workflow?.context?.entity?.ballerineEntityId) {
        return workflow?.context?.entity;
      }

      if (getDocumentEntityType(document) === 'director') {
        return directors.find(director => director.ballerineEntityId === document.endUserId);
      }

      if (getDocumentEntityType(document) === 'ubo') {
        return ubos.find(ubo => ubo.entity.id === document.endUserId)?.context?.entity?.data;
      }

      return null;
    },
    [directors, ubos, workflow?.context?.entity, getDocumentEntityType],
  );

  // Documents are sorted in following order: business, ubo, director
  const sortedDocuments = useMemo(() => {
    if (!documents?.length) {
      return [];
    }

    return [...documents].sort((a, b) => {
      const typeA = getDocumentEntityType(a);
      const typeB = getDocumentEntityType(b);

      // Order: business, ubo, director
      if (typeA === 'business' && typeB !== 'business') {
        return -1;
      }

      if (typeA !== 'business' && typeB === 'business') {
        return 1;
      }

      if (typeA === 'ubo' && typeB !== 'ubo') {
        return -1;
      }

      if (typeA !== 'ubo' && typeB === 'ubo') {
        return 1;
      }

      return 0;
    });
  }, [documents, getDocumentEntityType]);

  return {
    documents: sortedDocuments,
    documentsSchemas,
    isLoading,
    getDocumentEntityType,
    getDocumentEntity,
  };
};
