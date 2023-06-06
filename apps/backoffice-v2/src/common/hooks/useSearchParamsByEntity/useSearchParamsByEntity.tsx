import { ZodSchema } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { IUseZodSearchParams } from '../useZodSearchParams/interfaces';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';
import { useAuthenticatedUserQuery } from '../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useMemo } from 'react';
import { useEntityType } from '../useEntityType/useEntityType';

export const useSearchParamsByEntity = <TSchema extends ZodSchema>(
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
    // @ts-ignore
    schema ? EntitySearchSchema.merge(schema) : EntitySearchSchema,
    options,
  );
};
