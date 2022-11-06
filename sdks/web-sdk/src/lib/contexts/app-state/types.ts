import { SvelteComponent } from 'svelte';
import { Steps } from '../configuration/types';

export enum DocumentType {
  PASSPORT = 'passport', // CARD
  DRIVERS_LICENSE = 'drivers_license', // CARD
  RESIDENCE_PERMIT = 'residence_permit', // CARD
  ID_CARD = 'id_card', // CARD
  VOTER_ID = 'voter_id', // CARD
  WORK_PERMIT = 'work_permit', // CARD
  VISA = 'visa', // CARD
  BANK_STATEMENT = 'bank_statement', // A4
  PROOF_OF_BUSINESS_TAX_ID = 'proof_of_business_tax_id', // A4
  OPERATING_LICENSE = 'operating_license', // A4
  BUSINESS_REGISTRATION = 'business_registration', // A4
  SELFIE = 'selfie',
}

export enum DocumentVariant {
  A4 = 'a4',
  REGULAR = 'regular',
}

export interface IDocumentInfo {
  backSide: boolean;
  variant: DocumentVariant;
  type: DocumentType;
}

export type IPageSide = 'front' | 'back';
export interface IDocumentPage {
  base64?: string;
  uri?: string;
  side: IPageSide;
}

export interface IDocument {
  type: DocumentType;
  metadata: Record<string, string>;
  pages: IDocumentPage[];
}

export interface IStoreData {
  docs: IDocument[];
  selectedDocumentInfo?: IDocumentInfo;
  selfie?: string;
}

export interface IStep {
  name: Steps;
  id: string;
  component: typeof SvelteComponent;
}

export interface IStore {
  currentStepIndex: number;
  data: IStoreData;
}

export interface DevMocks {
  resultTime: number | string;
  reasonCode: number;
  code: number;
  idvResult: DecisionStatus;
}

export enum DecisionStatus {
  APPROVED = 'approved',
  RESUBMISSION_REQUESTED = 'resubmission_requested',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned',
  REVIEW = 'review',
}

export interface IAppState {
  currentStepIdx: number;
  currentPage: string;
  previousPage: string;
}

export type ISelectedParams = Record<string, string | boolean>;
