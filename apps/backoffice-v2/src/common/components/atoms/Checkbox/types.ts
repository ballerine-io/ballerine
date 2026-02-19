import { ChangeEventHandler } from 'react';

export type TCheckboxGroupState =
  | {
      values: unknown[];
      onChange: ChangeEventHandler<HTMLInputElement>;
    }
  | undefined;
