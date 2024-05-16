import { useMemo } from 'react';
import { AnyZodObject } from 'zod';

import { TEntityType, useEntityType } from '../useEntityType/useEntityType';
import { ISerializedSearchParams } from '../useZodSearchParams/interfaces';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const useEntitySearchSchema = <TSchema extends AnyZodObject>({
  schema,
  entity,
  authenticatedUserId,
}: {
  schema?: TSchema;
  entity: TEntityType;
  authenticatedUserId: string | null;
}) => {
  const EntitySearchSchema = useMemo(
    () =>
      entity === 'individuals'
        ? IndividualsSearchSchema(authenticatedUserId)
        : BusinessesSearchSchema(authenticatedUserId),
    [entity, authenticatedUserId],
  );

  return schema ? EntitySearchSchema.merge(schema) : EntitySearchSchema;
};

export const useSearchParamsByEntity = <TSchema extends AnyZodObject>(
  schema?: TSchema,
  options: ISerializedSearchParams = {},
) => {
  const entity = useEntityType();
  const { data: session } = useAuthenticatedUserQuery();

  const EntitySearchSchema = useEntitySearchSchema({
    schema,
    entity,
    authenticatedUserId: session?.user?.id,
  });

  return useZodSearchParams(EntitySearchSchema, options);
};
