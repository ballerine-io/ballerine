import { AnyObject } from '@common/types';
import { ArrayFieldLayoutItem } from '@components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayout';
import { ctw } from '@utils/ctw';

interface ArrayFieldsLayoutItemProps {
  element: ArrayFieldLayoutItem;
  uiSchema: AnyObject;
  disableDeletion?: boolean;
}

export const ArrayFieldsLayoutItem = ({
  element,
  uiSchema,
  disableDeletion,
}: ArrayFieldsLayoutItemProps) => {
  const { removeText = 'Delete', deleteButtonClassname = '' } = uiSchema;

  return (
    <div key={element.index} className="relative flex flex-row flex-nowrap">
      <div className="flex-1">{element.children}</div>
      <span
        className={ctw(
          'absolute right-0 top-0 inline-block cursor-pointer text-sm font-medium underline',
          deleteButtonClassname as string,
          { ['pointer-events-none opacity-50']: disableDeletion },
        )}
        onClick={element.onDropIndexClick(element.index)}
      >
        {removeText}
      </span>
    </div>
  );
};
