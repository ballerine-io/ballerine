import { EDocumentType } from '../../contexts/app-state';
import { IElementProps } from '../../contexts/configuration';
import { IDocumentOption } from '../../molecules/DocumentOption';

export type IDocumentOptionItem = { [key in EDocumentType]?: IDocumentOption };

export interface IDocumentOptions {
  options: IDocumentOptionItem;
  props: IElementProps;
  optionProps: IElementProps;
  iconContainerProps: IElementProps;
  iconProps: IElementProps;
  titleProps: IElementProps;
  descriptionProps?: IElementProps;
}
