import {
  documents,
  IDocument,
  IStoreData,
  selectedDocumentInfo,
  selfieUri,
} from '../contexts/app-state';
import { IAppConfiguration } from '../contexts/configuration';
import { verifyDocuments } from '../services/http';

export const broofa = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const verifyDocumentsAndCloseFlow = (configuration: IAppConfiguration) => {
  const endUserId = configuration.endUserInfo.id || broofa();
  let _documents: IDocument[] = [];
  let _selectedDocumentInfo;
  let _selfie;

  documents.update(d => {
    _documents = d;
    return d;
  });

  selectedDocumentInfo.update(d => {
    _selectedDocumentInfo = d;
    return d;
  });

  selfieUri.update(d => {
    _selfie = d;
    return d;
  });

  const data: IStoreData = {
    docs: _documents,
    selectedDocumentInfo: _selectedDocumentInfo,
    selfie: _selfie,
  };

  return verifyDocuments(data);
};
