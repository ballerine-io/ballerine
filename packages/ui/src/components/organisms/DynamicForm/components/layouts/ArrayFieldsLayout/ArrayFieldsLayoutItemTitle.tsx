import { ctw } from '@/utils/ctw';

export interface ArrayFieldsLayoutItemTitleProps {
  template: string;
  index: number;
  className?: string;
}

const formatTemplate = (template: string, index: number): string =>
  template.replace('{{INDEX}}', String(index + 1));

export const ArrayFieldsLayoutItemTitle = ({
  template,
  index,
  className,
}: ArrayFieldsLayoutItemTitleProps) => {
  return (
    <span className={ctw('font-inter text-base font-bold', className)}>
      {formatTemplate(template, index)}
    </span>
  );
};
