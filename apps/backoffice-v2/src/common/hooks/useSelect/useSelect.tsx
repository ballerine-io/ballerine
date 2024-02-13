import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';

export const useSelect = () => {
  const [{ selected }, setSearchParams] = useSerializedSearchParams();
  /**
   * Transforms objects of { [key: string]: string; } to { [key: string]: boolean; }
   */
  const parseBooleanishObject = useCallback((selected: unknown) => {
    const BooleanishSchema = z.record(
      z.string(),
      z.preprocess(value => (typeof value === 'string' ? JSON.parse(value) : value), z.boolean()),
    );
    const result = BooleanishSchema.safeParse(selected);

    if (result.success) {
      return result.data;
    }

    return {};
  }, []);
  const parsedSelect = useMemo(
    () => parseBooleanishObject(selected),
    [parseBooleanishObject, selected],
  );

  const onSelect = useCallback(
    (ids: Record<string, boolean>) => {
      setSearchParams({
        selected: ids,
      });
    },
    [setSearchParams],
  );

  const onClearSelect = useCallback(() => {
    setSearchParams({
      selected: {},
    });
  }, [setSearchParams]);

  return {
    selected: parsedSelect,
    onSelect,
    onClearSelect,
  };
};
