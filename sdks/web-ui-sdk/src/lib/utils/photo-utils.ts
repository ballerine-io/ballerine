import { IAppConfiguration, IAppConfigurationUI } from '../contexts/configuration';
import { IDocument, IDocumentPage } from '../contexts/app-state';
import Compressor from 'compressorjs';
import { IDocumentOptions } from '../organisms/DocumentOptions';
import { TDocumentType } from '../contexts/app-state/types';

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

    new Compressor(image, {
      quality: 0.6,
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = e => {
          const image = e.target?.result;
          resolve(image as string);
        };
      },
      error(err) {
        return reject(err.message);
      },
    });
  });
};

export const clearDocs = (
  type: TDocumentType,
  configuration: IAppConfiguration,
  uiPack: IAppConfigurationUI,
  documents: IDocument[],
): IDocument[] => {
  const documentOptionsConfiguration = configuration.components
    ?.documentOptions as IDocumentOptions;
  const { options } = documentOptionsConfiguration;
  const isFromOptions = Object.keys(options).find(t => t === type);
  if (isFromOptions) {
    return documents.filter(d => !Object.keys(options).find(t => t === d.type));
  }
  return documents.filter(d => type !== d.type);
};

export const addDocument = (
  type: TDocumentType,
  base64: string,
  configuration: IAppConfiguration,
  uiPack: IAppConfigurationUI,
  documents: IDocument[],
  document: IDocument,
): IDocument[] => {
  const clearedDocuments = clearDocs(type, configuration, uiPack, documents);
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
  document: IDocument,
  base64: string,
  documents: IDocument[],
): IDocument[] => {
  return documents.map(doc => {
    if ((document.kind && document.kind === doc.kind) || doc.type === document.type) {
      const newPagesState = getUpdatedPages(base64, doc);
      return { ...doc, pages: newPagesState };
    }
    return doc;
  });
};
