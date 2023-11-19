import { WorkflowFiltersProps } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters/types';
import { useWorkflowFilters } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { WorkflowsFiltersProvider } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/WorkflowsFiltersProvider';

type InputComponentProps<TProps> = Omit<TProps, keyof WorkflowFiltersProps>;

export function withWorkflowFilters<TComponentProps extends WorkflowFiltersProps>(
  Component: React.FunctionComponent<TComponentProps>,
): React.FunctionComponent<InputComponentProps<TComponentProps>> {
  function Wrapper(props: InputComponentProps<TComponentProps>) {
    return (
      <WorkflowsFiltersProvider>
        <ContextProvider {...props} />
      </WorkflowsFiltersProvider>
    );
  }

  function ContextProvider(props: InputComponentProps<TComponentProps>) {
    const context = useWorkflowFilters();

    return <Component {...({ ...props, ...context } as TComponentProps)} />;
  }

  ContextProvider.displayName = 'withWorkflowFilters(ContextConsumer)';

  Wrapper.displayName = `withWorkflowFilters(${Component.displayName})`;

  return Wrapper;
}
