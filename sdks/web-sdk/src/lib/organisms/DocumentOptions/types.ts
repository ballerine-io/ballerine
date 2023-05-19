import { type IElementProps } from '../../contexts/configuration';
import { type IDocumentOption } from '../../molecules/DocumentOption';
import { type TDocumentType } from '../../contexts/app-state/types';

export type IDocumentOptionItem = { [key in TDocumentType]?: IDocumentOption };

export interface IDocumentOptions {
  options: IDocumentOptionItem;
  props: IElementProps;
  optionProps: IElementProps;
  iconContainerProps: IElementProps;
  iconProps: IElementProps;
  titleProps: IElementProps;
  descriptionProps?: IElementProps;
}
