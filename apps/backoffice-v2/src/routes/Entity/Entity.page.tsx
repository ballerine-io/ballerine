import { Case } from './components/Case/Case';
import { useEntity } from './hooks/useEntity/useEntity';
import { ctw } from '../../utils/ctw/ctw';
import { Card, CardContent } from 'components/atoms/Card/card';

export const Entity = () => {
  const { selectedEntity, tasks, components } = useEntity();

  // Selected entity
  return (
    <Case>
      {/* Reject and approve header */}
      <Case.Actions
        id={selectedEntity.id}
        fullName={selectedEntity.fullName}
        avatarUrl={selectedEntity.avatarUrl}
      />
      <Case.Content>
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
      </Case.Content>
    </Case>
  );
};
