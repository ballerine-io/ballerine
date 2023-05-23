import { Subject } from 'components/organisms/Subject/Subject';
import { useIndividual } from 'components/pages/Individual/hooks/useIndividual/useIndividual';
import { ctw } from '../../../utils/ctw/ctw';
import { Card, CardContent } from 'components/atoms/Card/card';

export const Individual = () => {
  const { selectedEndUser, tasks, components } = useIndividual();

  // Selected end user
  return (
    <Subject>
      {/* Reject and approve header */}
      <Subject.Actions
        id={selectedEndUser.id}
        fullName={selectedEndUser.fullName}
        avatarUrl={selectedEndUser.avatarUrl}
        showResolutionButtons={selectedEndUser.workflow?.config?.workflowLevelResolution}
      />
      <Subject.Content>
        {Array.isArray(tasks) && tasks?.length > 0
          ? tasks?.map((task, index) => (
              <Card key={index} className={`me-4`}>
                <CardContent
                  className={ctw('grid gap-2', {
                    'grid-cols-2': task?.some(field => field?.type === 'multiDocuments'),
                  })}
                >
                  {task?.map((field, index) => {
                    const Cell = components[field?.type];

                    return <Cell key={index} {...field} />;
                  })}
                </CardContent>
              </Card>
            ))
          : null}
      </Subject.Content>
    </Subject>
  );
};
