import { useFiles } from '../hooks/internal/useFiles';

export interface IDocumentFile {
  id: string;
  fileId: string;
  documentId: string;
  name: string;
  mimeType: string;
  uri: string;
  createdAt: string;
}

export interface IDocument {
  id: string;
  businessId: string | null;
  endUserId: string | null;
  category: string;
  type: string;
  status: string;
  version: number;
  decision: string | null;
  decisionReason: string | null;
  comment: string | null;
  files?: IDocumentFile[];
}

export interface IDocumentWithFiles extends IDocument {
  files: IDocumentFile[];
}

export type TDocumentEntityType = 'business' | 'ubo' | 'director';

export interface IDocumentCreationData {
  category: string;
  type: string;
  issuingVersion: number;
  issuingCountry: string;
  documentType: string;
  documentVariant: string;
  documentPage: number;
  entityType: TDocumentEntityType;
  entityId: string;
}

export interface IDocumentsServiceContext {
  files: ReturnType<typeof useFiles>;
  documents: IDocument[];
  isLoadingDocuments: boolean;
}
