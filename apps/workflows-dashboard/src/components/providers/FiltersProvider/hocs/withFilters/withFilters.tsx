import {
  FiltersProvider,
  IFilterProviderProps,
} from '@/components/providers/FiltersProvider/FiltersProvider';
import { FiltersProps } from '@/components/providers/FiltersProvider/hocs/withFilters/types';
import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';

type InputComponentProps<TProps> = Omit<TProps, keyof FiltersProps>;

export interface WithFiltersHocParams<TFilterValues>
  extends Pick<IFilterProviderProps<TFilterValues>, 'deserializer' | 'querySchema'> {}

export function withFilters<TComponentProps extends FiltersProps, TFilterValues = object>(
  Component: React.FunctionComponent<TComponentProps>,
  params: WithFiltersHocParams<TFilterValues>,
): React.FunctionComponent<InputComponentProps<TComponentProps>> {
  function Wrapper(props: InputComponentProps<TComponentProps>) {
    return (
      <FiltersProvider {...(params as IFilterProviderProps)}>
        <ContextProvider {...props} />
      </FiltersProvider>
    );
  }

  function ContextProvider(props: InputComponentProps<TComponentProps>) {
    const context = useFilters();

    return <Component {...({ ...props, ...context } as TComponentProps)} />;
  }

  ContextProvider.displayName = 'withFilters(ContextConsumer)';

  Wrapper.displayName = `withFilters(${Component.displayName})`;

  return Wrapper;
}
