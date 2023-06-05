import { ChangeEventHandler } from 'react';

export type TCheckboxGroupState =
  | {
      values: Array<unknown>;
      onChange: ChangeEventHandler<HTMLInputElement>;
    }
  | undefined;
