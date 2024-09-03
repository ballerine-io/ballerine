/**
 * @TODO: Merge with `omitPropsFromObject` in a type-safe way *not trivial*
 * @param object
 * @param whitelist
 */
export const omitPropsFromObjectWhitelist = <
  TObj extends Record<string, any>,
  TKeys extends ReadonlyArray<keyof TObj>,
>({
  object,
  whitelist,
}: {
  object: TObj;
  whitelist: TKeys;
}): {
  [TKey in TKeys[number]]: TObj[TKey];
} & {} =>
  Object.entries(object ?? {}).reduce(
    (acc, [key, value]) => {
      if (!whitelist.includes(key)) {
        return acc;
      }

      acc[key as keyof typeof object] = value;

      return acc;
    },
    {} as {
      [TKey in TKeys[number]]: TObj[TKey];
    } & {},
  );
