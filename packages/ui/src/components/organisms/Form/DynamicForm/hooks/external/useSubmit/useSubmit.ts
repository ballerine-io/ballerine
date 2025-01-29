import { useCallback } from 'react';

export interface IUseSubmitParams<TValues extends object> {
  onSubmit?: (values: TValues) => void;
  values: TValues;
}

export const useSubmit = <TValues extends object>({
  onSubmit,
  values,
}: IUseSubmitParams<TValues>) => {
  const submit = useCallback(() => {
    onSubmit?.(values);
  }, [onSubmit, values]);

  return { submit };
};
