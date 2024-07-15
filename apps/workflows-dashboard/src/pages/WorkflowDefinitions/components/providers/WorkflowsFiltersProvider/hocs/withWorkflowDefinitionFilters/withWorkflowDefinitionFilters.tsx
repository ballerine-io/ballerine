import { useWorkflowDefinitionFilters } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowDefinitionFilters';
import { WorkflowDefinitionsFiltersProvider } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/WorkflowDefinitionsFiltersProvider';
import { WorkflowFiltersProps } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters/types';

type InputComponentProps<TProps> = Omit<TProps, keyof WorkflowFiltersProps>;

export function withWorkflowDefinitionFilters<TComponentProps extends WorkflowFiltersProps>(
  Component: React.FunctionComponent<TComponentProps>,
): React.FunctionComponent<InputComponentProps<TComponentProps>> {
  function Wrapper(props: InputComponentProps<TComponentProps>) {
    return (
      <WorkflowDefinitionsFiltersProvider>
        <ContextProvider {...props} />
      </WorkflowDefinitionsFiltersProvider>
    );
  }

  function ContextProvider(props: InputComponentProps<TComponentProps>) {
    const context = useWorkflowDefinitionFilters();

    return <Component {...({ ...props, ...context } as TComponentProps)} />;
  }

  ContextProvider.displayName = 'withWorkflowDefinitionFilters(ContextConsumer)';

  Wrapper.displayName = `withWorkflowDefinitionFilters(${Component.displayName})`;

  return Wrapper;
}
