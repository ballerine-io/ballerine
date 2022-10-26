import { DocumentType } from '../../contexts/appState';
import { IElementProps } from '../../contexts/configuration';
import { IDocumentOption } from '../../molecules/DocumentOption';

export type IDocumentOptionItem = { [key in DocumentType]?: IDocumentOption };

export interface IDocumentOptions {
  options: IDocumentOptionItem;
  props: IElementProps;
  optionProps: IElementProps;
  iconContainerProps: IElementProps;
  iconProps: IElementProps;
  titleProps: IElementProps;
  descriptionProps?: IElementProps;
}
