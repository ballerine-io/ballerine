import { z } from 'zod';

import { useZodSearchParams } from '../../../../common/hooks/useZodSearchParams/useZodSearchParams';

export const useFilterEntity = (): string | undefined => {
  const [{ entity }] = useZodSearchParams(
    z.object({
      entity: z.string().catch(''),
    }),
  );

  return entity;
};
