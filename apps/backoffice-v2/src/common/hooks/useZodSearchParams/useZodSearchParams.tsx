import { AnyZodObject, z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { IUseZodSearchParams } from './interfaces';
import { defaultDeserializer } from './utils/default-deserializer';
import { defaultSerializer } from './utils/default-serializer';

export const useZodSearchParams = <TSchema extends AnyZodObject>(
  schema: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const serializer = options.serializer ?? defaultSerializer;
  const deserializer = options.deserializer ?? defaultDeserializer;

  const searchParamsAsObject = useMemo(() => deserializer(search), [deserializer, search]);

  const parsedSearchParams = useMemo(
    () => schema.parse(searchParamsAsObject),
    [schema, searchParamsAsObject],
  );

  const onSetSearchParams = useCallback(
    (searchParams: Record<string, unknown>) => {
      navigate(
        `${pathname}${serializer({
          ...parsedSearchParams,
          ...searchParams,
        })}`,
        {
          state: {
            from: state?.from,
          },
        },
      );
    },
    [navigate, pathname, serializer, parsedSearchParams, state?.from],
  );

  useEffect(() => {
    onSetSearchParams(parsedSearchParams);
  }, []);

  return [parsedSearchParams as z.output<TSchema>, onSetSearchParams] as const;
};
