import { IAttributes } from '../../contexts/configuration';
import { IDocumentInfo } from '../../contexts/appState';

export interface IDocumentOption {
  attributes: IAttributes;
  document: IDocumentInfo;
}
