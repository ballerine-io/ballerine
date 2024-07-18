import {
  FiltersProvider,
  IFilterProviderProps,
} from '@/components/providers/FiltersProvider/FiltersProvider';
import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';
import { WorkflowFiltersProps } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters/types';

type InputComponentProps<TProps> = Omit<TProps, keyof WorkflowFiltersProps>;

export interface WithFiltersHocParams<TFilterValues>
  extends Pick<IFilterProviderProps<TFilterValues>, 'deserializer' | 'querySchema'> {}

export function withFilters<TComponentProps extends WorkflowFiltersProps, TFilterValues = object>(
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
