import { useMemo } from 'react';
import { AnyZodObject } from 'zod';

import { useEntityType } from '../useEntityType/useEntityType';
import { IUseZodSearchParams } from '../useZodSearchParams/interfaces';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const useSearchParamsByEntity = <TSchema extends AnyZodObject>(
  schema?: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const entity = useEntityType();
  const { data: session } = useAuthenticatedUserQuery();

  const EntitySearchSchema = useMemo(
    () =>
      entity === 'individuals'
        ? IndividualsSearchSchema(session?.user?.id)
        : BusinessesSearchSchema(session?.user?.id),
    [entity, session?.user?.id],
  );

  return useZodSearchParams(
    schema ? EntitySearchSchema.merge(schema) : EntitySearchSchema,
    options,
  );
};
