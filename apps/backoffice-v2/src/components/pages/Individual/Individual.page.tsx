import { Subject } from 'components/organisms/Subject/Subject';
import { useIndividual } from 'components/pages/Individual/hooks/useIndividual/useIndividual';

export const Individual = () => {
  const {
    selectedEndUser,
    workflowId,
    faceAUrl,
    faceBUrl,
    info,
    images,
    isLoading,
    whitelist,
    availableActions,
  } = useIndividual();

  // Selected end user
  return (
    <Subject>
      {/* Reject and approve header */}
      <Subject.Actions
        id={selectedEndUser.id}
        workflowId={workflowId}
        fullName={selectedEndUser.fullName}
        avatarUrl={selectedEndUser.avatarUrl}
        availableActions={availableActions}
      />

      <Subject.Content key={selectedEndUser.id}>
        <div>
          <Subject.FaceMatch faceAUrl={faceAUrl} faceBUrl={faceBUrl} isLoading={isLoading} />
          <Subject.Info info={info} isLoading={isLoading} whitelist={whitelist} />
        </div>
        <Subject.Documents documents={images} isLoading={isLoading} />
      </Subject.Content>
    </Subject>
  );
};
