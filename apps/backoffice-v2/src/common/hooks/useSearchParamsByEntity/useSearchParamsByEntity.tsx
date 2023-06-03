import { ZodSchema } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';
import { IUseZodSearchParams } from '../useZodSearchParams/interfaces';
import { BusinessesSearchSchema, IndividualsSearchSchema } from './validation-schemas';

export const useSearchParamsByEntity = <TSchema extends ZodSchema>(
  schema?: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const [searchParams] = useSearchParams();
  const entity = searchParams.get('entity');
  const EntitySchema = entity === 'individuals' ? IndividualsSearchSchema : BusinessesSearchSchema;

  return useZodSearchParams(
    // @ts-ignore
    schema ? EntitySchema.merge(schema) : EntitySchema,
    options,
  );
};
