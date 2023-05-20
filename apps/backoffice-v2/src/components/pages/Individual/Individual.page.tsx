import { Subject } from 'components/organisms/Subject/Subject';
import { useIndividual } from './hooks/useIndividual/useIndividual';
import { ctw } from '../../../utils/ctw/ctw';
import { Card, CardContent } from 'components/atoms/Card/card';

export const Individual = () => {
  const { selectedEntity, tasks, components } = useIndividual();

  // Selected entity
  return (
    <Subject>
      {/* Reject and approve header */}
      <Subject.Actions
        id={selectedEntity.id}
        fullName={selectedEntity.fullName}
        avatarUrl={selectedEntity.avatarUrl}
      />
      <Subject.Content>
        {Array.isArray(tasks) && tasks?.length > 0
          ? tasks?.map((task, index) => (
              <Card key={index}>
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
