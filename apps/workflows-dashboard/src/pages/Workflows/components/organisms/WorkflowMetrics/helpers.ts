import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { WorkflowStatusChartData } from '@app/pages/Workflows/components/organisms/WorkflowStatusChart';

// Assigning level to each status
function getSortLevelByStatus(status: IWorkflowStatus) {
  if (status === 'completed') return 1;
  if (status === 'active') return 2;
  if (status === 'failed') return 3;

  return 4;
}

// sorting data by status level
// lower status levels going first after sort
export function sortWorkflowChartDataByStatus(data: WorkflowStatusChartData[]) {
  return [...data].sort((dataA, dataB) => {
    const dataASortLevel = getSortLevelByStatus(dataA.status);
    const dataBSortLevel = getSortLevelByStatus(dataB.status);

    return dataASortLevel - dataBSortLevel;
  });
}
