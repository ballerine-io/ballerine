import { TUIElement } from '@ballerine/common';


export type TElementEvent =
  | 'onChange'
  | 'onMount'
  | 'onBlur'
  | 'onFocus'
  | 'onSubmit'
  | 'onClick'
  | 'onUnmount';


export type TFormEventElement = TUIElement & {
  formattedValueDestination: string;
  formattedId: string;
}
