import { ZodSchema } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { IUseZodSearchParams } from '../useZodSearchParams/interfaces';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';
import { useAuthenticatedUserQuery } from '../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useMemo } from 'react';
import { CaseStatus } from '../../enums';

export const useSearchParamsByEntity = <TSchema extends ZodSchema>(
  schema?: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const [searchParams] = useSearchParams();
  const entity = searchParams.get('entity');
  const { data: session } = useAuthenticatedUserQuery();
  const EntitySearchSchema = useMemo(
    () => (entity === 'individuals' ? IndividualsSearchSchema : BusinessesSearchSchema),
    [entity],
  );

  return useZodSearchParams(
    // @ts-ignore
    schema ? EntitySearchSchema.merge(schema) : EntitySearchSchema,
    {
      filter: {
        approvalState: [],
        assigneeId: [session?.user?.id, null],
        caseStatus: [CaseStatus.ACTIVE],
      },
    },
    options,
  );
};
