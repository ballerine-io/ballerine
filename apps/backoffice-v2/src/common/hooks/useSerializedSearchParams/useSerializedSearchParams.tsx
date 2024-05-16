import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { defaultDeserializer } from '@/common/hooks/useZodSearchParams/utils/default-deserializer';
import { defaultSerializer } from '@/common/hooks/useZodSearchParams/utils/default-serializer';
import { ISerializedSearchParams } from '@/common/hooks/useZodSearchParams/interfaces';

export const useSerializedSearchParams = (options: ISerializedSearchParams = {}) => {
  const { search, pathname, state } = useLocation();
  const serializer = options.serializer ?? defaultSerializer;
  const deserializer = options.deserializer ?? defaultDeserializer;
  const searchParamsAsObject = useMemo(() => deserializer(search), [deserializer, search]);
  const navigate = useNavigate();

  const setSearchParams = useCallback(
    (searchParams: Record<PropertyKey, unknown>) => {
      navigate(
        `${pathname}${serializer({
          ...searchParamsAsObject,
          ...searchParams,
        })}`,
        {
          state,
        },
      );
    },
    [navigate, pathname, searchParamsAsObject, serializer, state],
  );

  return [searchParamsAsObject, setSearchParams] as const;
};
