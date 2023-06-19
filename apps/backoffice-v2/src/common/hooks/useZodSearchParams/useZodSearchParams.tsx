import { AnyZodObject, z } from 'zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { IUseZodSearchParams } from './interfaces';
import { defaultDeserializer } from './utils/default-deserializer';
import { defaultSerializer } from './utils/default-serializer';

export const useZodSearchParams = <TSchema extends AnyZodObject>(
  schema: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const [_searchParams, setSearchParams] = useSearchParams();
  const { search, pathname } = useLocation();
  const deserializer = options.deserializer ?? defaultDeserializer;
  const serializer = options.serializer ?? defaultSerializer;
  const searchParamsAsObject = useMemo(() => deserializer(search), [deserializer, search]);
  const parsedSearchParams = useMemo(
    () => schema.parse(searchParamsAsObject),
    [schema, searchParamsAsObject],
  );
  const navigate = useNavigate();
  const onSetSearchParams = useCallback(
    (searchParams: Record<string, unknown>) => {
      navigate(
        `${pathname}${serializer({
          ...parsedSearchParams,
          ...searchParams,
        })}`,
      );
    },
    [pathname, parsedSearchParams, setSearchParams],
  );

  useEffect(() => {
    onSetSearchParams(parsedSearchParams);
  }, []);

  return [parsedSearchParams as z.output<TSchema>, onSetSearchParams] as const;
};
