import { IAppConfiguration } from '../contexts/configuration';
import { DocumentType, IDocument, IDocumentPage } from '../contexts/app-state';
import Compressor from 'compressorjs';
import { documentOptions } from '../default-configuration/theme';
import merge from 'deepmerge';

export type FileEventTarget = EventTarget & { files: FileList };
export type ICameraEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

export const nativeCameraHandler = (e: ICameraEvent): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!e.target) {
      return reject('Event target is missing');
    }
    const target = e.target as FileEventTarget;
    const image = target.files[0];
    const reader1 = new FileReader();
    reader1.readAsDataURL(image);

    reader1.onload = e => {
      const image = e.target?.result;
    };
    new Compressor(image, {
      quality: 0.6,
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = e => {
          const image = e.target?.result;
          resolve(image);
        };
      },
      error(err) {
        return reject(err.message);
      },
    });
  });
};

export const clearDocs = (
  type: DocumentType,
  configuration: IAppConfiguration,
  documents: IDocument[],
): IDocument[] => {
  const documentOptionsConfiguration = merge(documentOptions, configuration.documentOptions || {});
  const { options } = documentOptionsConfiguration;
  const isFromOptions = Object.keys(options).find(t => t === type);
  if (isFromOptions) {
    return documents.filter(d => !Object.keys(options).find(t => t === d.type));
  }
  return documents.filter(d => type !== d.type);
};

export const addDocument = (
  type: DocumentType,
  base64: string,
  configuration: IAppConfiguration,
  documents: IDocument[],
  document: IDocument,
): IDocument[] => {
  const clearedDocuments = clearDocs(type, configuration, documents);
  return [
    ...clearedDocuments,
    {
      ...document,
      pages: [{ side: 'front', base64 }],
    },
  ];
};

const getUpdatedPages = (base64: string, doc: IDocument): IDocumentPage[] => {
  const existingPage = doc.pages.find(p => p.side === 'back');
  if (existingPage) {
    return doc.pages.map(page => {
      if (page.side === 'back') {
        return {
          ...page,
          base64,
          side: 'back',
        };
      }
      return page;
    });
  }
  return [...doc.pages, { base64, side: 'back' }];
};

export const updateDocument = (
  type: DocumentType,
  base64: string,
  documents: IDocument[],
): IDocument[] => {
  return documents.map(doc => {
    if (doc.type === type) {
      const newPagesState = getUpdatedPages(base64, doc);
      return { ...doc, pages: newPagesState };
    }
    return doc;
  });
};
