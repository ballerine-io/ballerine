import { isZodError } from '../is-zod-error/is-zod-error';

export const handleZodError = <TData>(error: unknown, data: TData) => {
  if (!error || isZodError(error)) {
    return data ?? null;
  }

  throw error;
};
