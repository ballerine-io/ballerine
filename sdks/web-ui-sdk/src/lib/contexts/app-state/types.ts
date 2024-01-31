import { SvelteComponent } from 'svelte';
import { TSteps } from '../configuration/types';

export const DocumentType = {
  PASSPORT: 'passport', // CARD
  DRIVERS_LICENSE: 'drivers_license', // CARD
  RESIDENCE_PERMIT: 'residence_permit', // CARD
  ID_CARD: 'id_card', // CARD
  VOTER_ID: 'voter_id', // CARD
  WORK_PERMIT: 'work_permit', // CARD
  VISA: 'visa', // CARD
  BANK_STATEMENT: 'bank_statement', // A4
  PROOF_OF_BUSINESS_TAX_ID: 'proof_of_business_tax_id', // A4
  OPERATING_LICENSE: 'operating_license', // A4
  BUSINESS_REGISTRATION: 'business_registration', // A4
  SELFIE: 'selfie',
} as const;

export type ObjectValues<TObject> = TObject[keyof TObject];

export type TDocumentType = ObjectValues<typeof DocumentType>;

export const DocumentKind = {
  PASSPORT: 'passport',
  ID_CARD: 'id_card',
  DRIVERS_LICENSE: 'drivers_license',
  SELFIE: 'selfie',
  VOTER_ID: 'voter_id',
  IFE_CARD: 'ife_card',
  INE_CARD: 'ine_card',
} as const;

export type TDocumentKind = ObjectValues<typeof DocumentKind>;

export const DocumentVariant = {
  A4: 'a4',
  REGULAR: 'regular',
} as const;

export type TDocumentVariant = ObjectValues<typeof DocumentVariant>;

export interface IDocumentInfo {
  backSide: boolean;
  variant: TDocumentVariant;
  type: TDocumentType;
  kind: TDocumentKind;
  orderIndex: number;
}

export type IPageSide = 'front' | 'back' | 'selfie';

export interface IDocumentPage {
  base64?: string;
  uri?: string;
  side: IPageSide;
}

export interface IDocument {
  type: TDocumentType;
  kind?: TDocumentKind;
  metadata: Record<string, string>;
  pages: IDocumentPage[];
}

export interface IStoreData {
  docs: IDocument[];
  selectedDocumentInfo?: IDocumentInfo;
  selfie?: string;
}

export interface IStep {
  name: TSteps;
  id: string;
  component: typeof SvelteComponent;
}

export interface IStore {
  currentStepIndex: number;
  data: IStoreData;
}

export const DecisionStatus = {
  APPROVED: 'approved',
  RESUBMISSION_REQUESTED: 'resubmission_requested',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  ABANDONED: 'abandoned',
  REVIEW: 'review',
} as const;

export type TDecisionStatus = ObjectValues<typeof DecisionStatus>;

export interface DevMocks {
  resultTime: number | string;
  reasonCode: number;
  code: number;
  idvResult: TDecisionStatus;
}

export interface IAppState {
  currentStepIdx: number;
  currentPage: string;
  previousPage: string;
}

export type ISelectedParams = Record<string, string | boolean>;
