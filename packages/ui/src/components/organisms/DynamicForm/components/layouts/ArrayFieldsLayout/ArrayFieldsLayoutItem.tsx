import { AnyObject } from '@common/types';
import { ArrayFieldLayoutItem } from '@components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout/ArrayFieldsLayout';
import { ctw } from '@utils/ctw';

interface ArrayFieldsLayoutItemProps {
  element: ArrayFieldLayoutItem;
  uiSchema: AnyObject;
  disableDeletion?: boolean;
  title?: string | React.ReactNode;
}

export const ArrayFieldsLayoutItem = ({
  element,
  uiSchema,
  disableDeletion,
  title,
}: ArrayFieldsLayoutItemProps) => {
  const { removeText = 'Delete', deleteButtonClassname = '' } = uiSchema;

  return (
    <div key={element.index} className="relative flex flex-row flex-nowrap">
      <div className="flex w-full flex-col gap-4">
        <div className={ctw('flex flex-row items-center', { 'justify-between': Boolean(title) })}>
          {title ? title : null}
          <span
            className={ctw(
              'inline-block cursor-pointer text-xs font-medium leading-6 underline',
              deleteButtonClassname as string,
              { ['pointer-events-none opacity-50']: disableDeletion },
            )}
            onClick={element.onDropIndexClick(element.index)}
          >
            {removeText}
          </span>
        </div>
        <div>{element.children}</div>
      </div>
    </div>
  );
};
