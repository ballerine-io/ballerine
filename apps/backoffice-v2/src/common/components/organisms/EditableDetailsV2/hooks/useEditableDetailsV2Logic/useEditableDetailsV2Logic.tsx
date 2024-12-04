import { ComponentProps, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { EditableDetailsV2 } from '../../EditableDetailsV2';
import { isPathMatch } from '../../utils/is-path-match';
import { isObject } from '@ballerine/common';
import { set, get } from 'lodash-es';

export const useNewEditableDetailsLogic = ({
  fields,
  blacklist,
  whitelist,
  onSubmit,
}: Pick<
  ComponentProps<typeof EditableDetailsV2>,
  'fields' | 'blacklist' | 'whitelist' | 'onSubmit'
>) => {
  // Should support multiple levels of nesting, arrays, objects, and multiple path syntaxes
  const filterValue = useCallback(
    ({ path, root }: { path: string; root: string }) =>
      (value: any): any => {
        if (!blacklist && !whitelist) {
          return value;
        }

        if (isObject(value)) {
          return Object.entries(value).reduce((acc, [key, value]) => {
            const fullPath = `${path}.${key}`;
            const isBlacklisted = blacklist?.some(pattern =>
              isPathMatch({
                pattern,
                path: fullPath,
                root,
              }),
            );
            const isWhitelisted =
              !whitelist ||
              whitelist?.some(pattern =>
                isPathMatch({
                  pattern,
                  path: fullPath,
                  root,
                }),
              );

            if (isBlacklisted) {
              return acc;
            }

            if (isWhitelisted) {
              acc[key] = filterValue({ path: fullPath, root })(value);
            }

            return acc;
          }, {} as Record<PropertyKey, any>);
        }

        if (Array.isArray(value)) {
          return value.map((item, index) => filterValue({ path: `${path}.${index}`, root })(item));
        }

        return value;
      },
    [blacklist, whitelist],
  );

  const filteredFields = useMemo(() => {
    return fields.filter(field => {
      if (blacklist) {
        return !blacklist.some(pattern =>
          isPathMatch({
            pattern,
            path: field.path,
            root: field.root,
          }),
        );
      }

      if (whitelist) {
        return whitelist.some(pattern =>
          isPathMatch({
            pattern,
            path: field.path,
            root: field.root,
          }),
        );
      }

      return true;
    });
  }, [fields, blacklist, whitelist]);
  const defaultValues = useMemo(
    () =>
      filteredFields.reduce((acc, curr) => {
        set(acc, curr.path, curr.value);

        return acc;
      }, {} as Record<string, any>),
    [filteredFields],
  );
  const form = useForm({
    defaultValues,
  });

  const handleSubmit: SubmitHandler<Record<string, any>> = useCallback(
    values => {
      const updatedData = fields.reduce((acc, curr) => {
        const value = get(values, curr.path);
        const defaultValue = get(defaultValues, curr.path);

        if (value === defaultValue) {
          return acc;
        }

        if (curr.id) {
          const pathToObject = curr.path.split('.').slice(0, -1).join('.');

          set(acc, `${pathToObject}.id`, curr.id);
        }

        set(acc, curr.path, value);

        return acc;
      }, {} as Record<string, any>);

      onSubmit(updatedData);
    },
    [fields, defaultValues, onSubmit],
  );

  return {
    form,
    handleSubmit,
    filteredFields,
  };
};
