import { WorkflowsTable } from './WorkflowsTable';
import { WorkflowTableItem } from './types';

export default {
  component: WorkflowsTable,
};

function createTableData(count: number): WorkflowTableItem[] {
  return new Array(count).fill(null).map((_, index) => ({
    id: `element-id-${index}`,
    workflowDefinitionName: `Workflow-Name-${index}`,
    workflowDefinitionId: `Workflow-ID-${index}`,
    status: 'active',
    state: null,
    assignee: null,
    context: {
      some_context: 'hello world',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    resolvedAt: new Date(),
  }));
}

export const Default = {
  render: () => <WorkflowsTable items={createTableData(10)} onSort={() => {}} />,
};

export const Rounded = {
  render: () => (
    <WorkflowsTable.Container>
      <WorkflowsTable items={createTableData(10)} onSort={() => {}} />
    </WorkflowsTable.Container>
  ),
};

export const StickyHeader = {
  render: () => (
    <div className="h-[500px]">
      <WorkflowsTable.Container>
        <WorkflowsTable items={createTableData(10)} onSort={() => {}} />
      </WorkflowsTable.Container>
    </div>
  ),
};

export const FancyScrollbars = {
  render: () => (
    <div className="h-[500px]">
      <WorkflowsTable.Container>
        <WorkflowsTable.ScrollContainer>
          <WorkflowsTable items={createTableData(10)} onSort={() => {}} />
        </WorkflowsTable.ScrollContainer>
      </WorkflowsTable.Container>
    </div>
  ),
};

export const FetchingData = {
  render: () => (
    <WorkflowsTable.Container isFetching>
      <WorkflowsTable items={createTableData(10)} onSort={() => {}} />
    </WorkflowsTable.Container>
  ),
};

export const Empty = {
  render: () => <WorkflowsTable items={[]} onSort={() => {}} isFetching={false} />,
};
