import { AnyObject } from '@ballerine/ui';

export interface IDocumentTemplate {
  id: string;
  category: string;
  type: string;
  issuer: {
    country: string;
  };
  version: string;
  issuingVersion: number;
  properties: AnyObject;
}
