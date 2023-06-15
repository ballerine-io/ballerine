import { AnyZodObject } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { IUseZodSearchParams } from '../useZodSearchParams/interfaces';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';
import { useAuthenticatedUserQuery } from '../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useMemo } from 'react';

export const useSearchParamsByEntity = <TSchema extends AnyZodObject>(
  schema?: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const [searchParams] = useSearchParams();
  const entity = searchParams.get('entity');
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
