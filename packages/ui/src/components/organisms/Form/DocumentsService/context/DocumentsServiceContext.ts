import { createContext } from 'react';
import { IDocumentsServiceContext } from '../types';

export const DocumentsServiceContext = createContext<IDocumentsServiceContext>({
  files: {
    files: {},
    setFile: () => {},
    removeFile: () => {},
    composeFileId: () => '',
  },
  documents: [],
  isLoadingDocuments: false,
});
