import { AnyObject } from '@/common/types';
import { ArrayFieldLayoutItem } from '@/components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayout';
import { ctw } from '@/utils/ctw';
import React, { useCallback } from 'react';

interface ArrayFieldsLayoutItemProps {
  element: ArrayFieldLayoutItem;
  uiSchema: AnyObject;
  disableDeletion?: boolean;
  title?: string | React.ReactNode;
  testId?: string;
  onDelete?: (index: number) => void;
}

export const ArrayFieldsLayoutItem = ({
  element,
  uiSchema,
  disableDeletion,
  title,
  testId,
  onDelete,
}: ArrayFieldsLayoutItemProps) => {
  const { removeText = 'Delete', deleteButtonClassname = '' } = uiSchema;

  const createDeleteHandler = useCallback(() => {
    return (event: React.MouseEvent) => {
      element.onDropIndexClick(element.index)(event);
      onDelete?.(element.index);
    };
  }, [element, onDelete]);

  return (
    <div key={element.index} className="relative flex flex-row flex-nowrap" data-testid={testId}>
      <div className="flex w-full flex-col gap-4">
        <div className={ctw('flex flex-row items-center', { 'justify-between': Boolean(title) })}>
          {title ? title : null}
          <span
            className={ctw(
              'inline-block cursor-pointer text-xs font-medium leading-6 underline',
              deleteButtonClassname as string,
              { ['pointer-events-none opacity-50']: disableDeletion },
            )}
            onClick={createDeleteHandler()}
            data-testid={testId ? `${testId}-delete-button` : undefined}
          >
            {removeText}
          </span>
        </div>
        <div data-testid={testId ? `${testId}-element-container` : undefined}>
          {element.children}
        </div>
      </div>
    </div>
  );
};
