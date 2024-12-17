import { TBaseFormElements } from '../../../../types';

import { ICommonFieldParams } from '../../../../types';

import { IFormElement } from '../../../../types';

export type TElementEvent =
  | 'onChange'
  | 'onMount'
  | 'onBlur'
  | 'onFocus'
  | 'onSubmit'
  | 'onUnmount';

export interface IFormEventElement<
  TElements extends string = TBaseFormElements,
  TParams = ICommonFieldParams,
> extends IFormElement<TElements, TParams> {
  formattedValueDestination: string;
  formattedId: string;
}
