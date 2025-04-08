import { AnyRecord } from '@ballerine/common';
import { Document } from '@prisma/client';

export interface IUIDefinitionPage {
  stateName: string;
  elements: IFormElement[];
}

export interface IFormElement<TParams = object> {
  id: string;
  valueDestination: string;
  element: string;
  children?: IFormElement[];
  params?: TParams;
}

export type TDeepthLevelStack = number[];

export interface IDocumentTemplate {
  // Id of document template
  id: string;
  category: string;
  type: string;
  issuer: {
    country: string;
  };
  version: number;
  issuingVersion: number;
  properties: AnyRecord;
  pages: AnyRecord[];
  status?: Document['status'];
  decision?: Document['decision'];
  _document?: {
    id: string;
  };
}
