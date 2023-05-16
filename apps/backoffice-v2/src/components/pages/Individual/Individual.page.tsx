import { Subject } from 'components/organisms/Subject/Subject';
import { useIndividual } from 'components/pages/Individual/hooks/useIndividual/useIndividual';
import { ctw } from '../../../utils/ctw/ctw';

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
        {Array.isArray(tasks) && tasks?.length > 0
          ? tasks?.map((task, index) => (
              <div
                className={ctw(
                  'grid gap-2 rounded border border-slate-300 bg-slate-200 p-1 shadow',
                  {
                    'grid-cols-2': task?.some(field => field?.type === 'multiDocuments'),
                  },
                )}
                key={index}
              >
                {task?.map((field, index) => {
                  const Cell = components[field?.type];

                  return <Cell key={index} {...field} />;
                })}
              </div>
            ))
          : null}
      </Subject.Content>
    </Subject>
  );
};
