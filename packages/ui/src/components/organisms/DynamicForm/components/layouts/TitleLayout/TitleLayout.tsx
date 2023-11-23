import { getArrayFieldItemTitleIndex } from '@/components/organisms/DynamicForm/components/layouts/TitleLayout/helpers';
import { TitleFieldProps } from '@rjsf/utils';
import clsx from 'clsx';

export const TitleLayout = ({ id, title, required, uiSchema }: TitleFieldProps) => {
  const { titleClassName = '' } = uiSchema || {};

  const index = getArrayFieldItemTitleIndex(id);

  return title ? (
    <header id={id}>
      <p className={clsx('pb-4 text-3xl font-semibold', titleClassName as string)}>
        {title} {`${typeof index === 'number' ? `- ${index + 1}` : ''}`}{' '}
        {required && <mark className="bg-transparent text-sm">*</mark>}
      </p>
    </header>
  ) : null;
};
