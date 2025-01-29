import { ICommonFieldParams } from '../../../../types';

import { IFormElement } from '../../../../types';

export type TElementEvent =
  | 'onChange'
  | 'onMount'
  | 'onBlur'
  | 'onFocus'
  | 'onSubmit'
  | 'onClick'
  | 'onUnmount';

export interface IFormEventElement<TElements extends string, TParams = ICommonFieldParams>
  extends IFormElement<TElements, TParams> {
  formattedValueDestination: string;
  formattedId: string;
}
