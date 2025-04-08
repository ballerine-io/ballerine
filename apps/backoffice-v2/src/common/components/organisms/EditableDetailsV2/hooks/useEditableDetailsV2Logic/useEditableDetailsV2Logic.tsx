import { ComponentProps, useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EditableDetailsV2 } from '../../EditableDetailsV2';
import { isPathMatch } from '../../utils/is-path-match';
import { isObject } from '@ballerine/common';
import { get, set } from 'lodash-es';
import { sortData } from '@/lib/blocks/utils/sort-data';
import { useToggle } from '@/common/hooks/useToggle/useToggle';

export const useEditableDetailsV2Logic = ({
  fields,
  onSubmit,
  onCancel,
  onEnableIsEditable,
  config,
}: Pick<
  ComponentProps<typeof EditableDetailsV2>,
  'fields' | 'onSubmit' | 'onCancel' | 'onEnableIsEditable' | 'config'
>) => {
  const [isEditable, _toggleIsEditable, toggleOnIsEditable, toggleOffIsEditable] = useToggle(false);
  const sortedFields = useMemo(
    () =>
      sortData({
        data: fields,
        direction: config?.sort?.direction,
        predefinedOrder: config?.sort?.predefinedOrder,
      }),
    [fields, config?.sort?.direction, config?.sort?.predefinedOrder],
  );
  // Should support multiple levels of nesting, arrays, objects, and multiple path syntaxes
  const filterValue = useCallback(
    ({ path, root }: { path: string; root: string }) =>
      (value: any): any => {
        if (!config.blacklist && !config.whitelist) {
          return value;
        }

        if (isObject(value)) {
          return Object.entries(value).reduce((acc, [key, value]) => {
            const fullPath = `${path}.${key}`;
            const isBlacklisted = config.blacklist?.some(pattern =>
              isPathMatch({
                pattern,
                path: fullPath,
                root,
              }),
            );
            const isWhitelisted =
              !config.whitelist ||
              config.whitelist?.some(pattern =>
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
    [config.blacklist, config.whitelist],
  );

  const filteredFields = useMemo(() => {
    return sortedFields.filter(field => {
      if (config.blacklist) {
        return !config.blacklist.some(pattern =>
          isPathMatch({
            pattern,
            path: field.path,
            root: field.root,
          }),
        );
      }

      if (config.whitelist) {
        return config.whitelist.some(pattern =>
          isPathMatch({
            pattern,
            path: field.path,
            root: field.root,
          }),
        );
      }

      return true;
    });
  }, [sortedFields, config.blacklist, config.whitelist]);
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

  const isEditableAndEditingEnabled = useMemo(() => {
    return !config.actions.editing.disabled && isEditable;
  }, [config.actions.editing.disabled, isEditable]);

  const isEditingActionsVisible = useMemo(() => {
    return isEditable && filteredFields?.some(({ props }) => props.isEditable);
  }, [filteredFields, isEditable]);

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

      onSubmit(updatedData, toggleOffIsEditable);
    },
    [fields, defaultValues, onSubmit],
  );

  const handleCancel = useCallback(() => {
    form.reset(defaultValues);

    onCancel(toggleOffIsEditable);
  }, [defaultValues, form.reset, onCancel, toggleOffIsEditable]);

  const handleEnableIsEditable = useCallback(() => {
    onEnableIsEditable(toggleOnIsEditable);
  }, [onEnableIsEditable, toggleOnIsEditable]);

  return {
    form,
    handleSubmit,
    handleCancel,
    handleEnableIsEditable,
    filteredFields,
    isEditable: isEditableAndEditingEnabled,
    toggleOnIsEditable,
    toggleOffIsEditable,
    isEditingActionsVisible,
  };
};
