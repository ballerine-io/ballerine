import { type IAttributes } from '../../contexts/configuration';
import { type IDocumentInfo } from '../../contexts/app-state';

export interface IDocumentOption {
  attributes: IAttributes;
  document: IDocumentInfo;
}
