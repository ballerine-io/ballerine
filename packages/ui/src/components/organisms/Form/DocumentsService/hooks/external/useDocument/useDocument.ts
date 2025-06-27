import { useMemo } from 'react';
import { TDocumentEntityType } from '../../../types';
import { useDocumentsService } from '../../internal/useDocumentsService';

interface IUseDocumentParams {
  type: string;
  category: string;
  entityType: TDocumentEntityType;
  entityId: string;
}

export const useDocument = ({ type, category, entityType, entityId }: IUseDocumentParams) => {
  const { documents } = useDocumentsService();

  const document = useMemo(() => {
    const entityDocuments = documents.filter(document => {
      if (entityType === 'business') {
        return document.businessId === entityId;
      }

      return document.endUserId === entityId;
    });

    return entityDocuments.find(
      document => document.type === type && document.category === category,
    );
  }, [documents, type, category, entityType, entityId]);

  return document;
};
