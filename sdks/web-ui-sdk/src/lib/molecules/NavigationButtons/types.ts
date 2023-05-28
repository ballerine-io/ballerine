import { IElementProps } from '../../contexts/configuration';

export interface INavigationButtons {
  backButton: {
    type: 'iconButton' | 'button' | 'buttonWithIcon';
    props: IElementProps;
  };
  nextButton: {
    type: 'iconButton' | 'button' | 'buttonWithIcon';
    props: IElementProps;
  };
  props: IElementProps;
}
