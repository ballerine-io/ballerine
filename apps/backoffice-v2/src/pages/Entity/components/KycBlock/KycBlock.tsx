import { FunctionComponent } from 'react';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useKycBlock } from './hooks/useKycBlock/useKycBlock';
import { Card } from '../../../../common/components/atoms/Card/Card';
import { CardContent } from '../../../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { cells } from '../../hooks/useEntity/cells';

export const KycBlock: FunctionComponent<{
  childWorkflow: TWorkflowById['childWorkflows'][number];
}> = ({ childWorkflow }) => {
  const childTasks = useKycBlock(childWorkflow) ?? [];

  return (
    <>
      {Array.isArray(childTasks) &&
        childTasks?.length > 0 &&
        childTasks?.map((childTask, index) => {
          if (!Array.isArray(childTask) || !childTask?.length) return;

          return (
            <Card key={index} className={`me-4`}>
              <CardContent
                className={ctw('grid gap-2', {
                  'grid-cols-2': childTask?.some(field => field?.type === 'multiDocuments'),
                })}
              >
                {childTask?.map((field, index) => {
                  const Cell = cells[field?.type];

                  return <Cell key={index} {...field} />;
                })}
              </CardContent>
            </Card>
          );
        })}
    </>
  );
};
