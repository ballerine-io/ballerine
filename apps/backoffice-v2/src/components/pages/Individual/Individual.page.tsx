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
      />
      <Subject.Content>
        {tasks?.map((task, index) => (
          <Card key={index}>
            <CardContent
              className={ctw('grid gap-2', {
                'grid-cols-2': task?.some(field => field?.type === 'multiDocuments'),
              })}
            >
              {task?.map(field => components[field.type]?.(field))}
            </CardContent>
          </Card>
        ))}
      </Subject.Content>
    </Subject>
  );
};
