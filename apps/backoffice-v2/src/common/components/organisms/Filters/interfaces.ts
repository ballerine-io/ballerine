import { TFilterInputType, TFiltersInputID } from '@/common/components/organisms/Filters/types';
import { AnyChildren } from '@ballerine/ui';

export interface IFilterDefinition<TFilterParams = unknown> {
  id: TFiltersInputID;
  label: string;
  params: TFilterParams;
  defaultValue?: unknown;
  type: TFilterInputType;
}

export interface IFilterInputParams<TInputParams = unknown, TInputValue = unknown> {
  filter: IFilterDefinition;
  inputParams: TInputParams;
  value: TInputValue;
  clear: () => void;
  onChange: (value: Array<string | null>) => void;
}

export interface IFilterValue {
  id: string;
  value: unknown;
}

export interface IFiltersProps {
  filters: Array<IFilterDefinition<unknown>>;
  values?: IFilterValue[];
  children: AnyChildren;
  className?: string;
  onChange: (value: IFilterValue) => void;
  onClear: (id: TFiltersInputID) => void;
}

export interface IFiltersHeaderProps {
  title: string | JSX.Element;
}

export interface IFiltersListProps {
  className?: string;
  children: (params: IFilterInputParams) => JSX.Element;
}
