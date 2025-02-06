import { useCallback } from 'react';

export interface IUseSubmitParams<TValues extends object> {
  onSubmit?: (values: TValues) => void;
}

export const useSubmit = <TValues extends object>({ onSubmit }: IUseSubmitParams<TValues>) => {
  const submit = useCallback(
    (values: TValues) => {
      onSubmit?.(values);
    },
    [onSubmit],
  );

  return { submit };
};
