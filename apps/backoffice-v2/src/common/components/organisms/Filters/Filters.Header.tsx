import { IFiltersHeaderProps } from '@/common/components/organisms/Filters/interfaces';
import { FunctionComponent } from 'react';

export const FiltersHeader: FunctionComponent<IFiltersHeaderProps> = ({ title }) => {
  return typeof title === 'string' ? (
    <h4 className={'leading-0 min-h-[16px] pb-7 text-xs font-bold'}>{title}</h4>
  ) : (
    title
  );
};
