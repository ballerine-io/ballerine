import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { defaultDeserializer } from '@/common/hooks/useZodSearchParams/utils/default-deserializer';
import { defaultSerializer } from '@/common/hooks/useZodSearchParams/utils/default-serializer';
import { ISerializedSearchParams } from '@/common/hooks/useZodSearchParams/interfaces';

export const useSerializedSearchParams = (options: ISerializedSearchParams = {}) => {
  const { search, pathname, state, hash } = useLocation();
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    replace = false,
  } = options;
  const searchParamsAsObject = useMemo(() => deserializer(search), [deserializer, search]);
  const navigate = useNavigate();

  const setSearchParams = useCallback(
    (searchParams: Record<PropertyKey, unknown>) => {
      navigate(
        `${pathname}${serializer({
          ...searchParamsAsObject,
          ...searchParams,
        })}${hash}`,
        { state, replace },
      );
    },
    [navigate, pathname, searchParamsAsObject, serializer, state, hash],
  );

  return [searchParamsAsObject, setSearchParams] as const;
};
