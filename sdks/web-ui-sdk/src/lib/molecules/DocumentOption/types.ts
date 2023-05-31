import { IAttributes } from '../../contexts/configuration';
import { IDocumentInfo } from '../../contexts/app-state';

export interface IDocumentOption {
  attributes: IAttributes;
  document: IDocumentInfo;
}
