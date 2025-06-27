import { useContext } from 'react';
import { DocumentsServiceContext } from '../../../context/DocumentsServiceContext';

export const useDocumentsService = () => {
  const context = useContext(DocumentsServiceContext);

  if (!context) {
    throw new Error('useDocumentsService must be used within a DocumentsService');
  }

  return context;
};
