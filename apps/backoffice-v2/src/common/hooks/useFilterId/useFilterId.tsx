import { z } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';

export const useFilterId = (): string | undefined => {
  const [{ filterId }] = useZodSearchParams(
    z.object({
      filterId: z.string().catch(''),
    }),
  );

  return filterId;
};
