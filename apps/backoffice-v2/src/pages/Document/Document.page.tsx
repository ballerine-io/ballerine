import { Case } from '../Entity/components/Case/Case';
import { useDocumentLogic } from '@/pages/Document/hooks/useDocumentLogic/useDocumentLogic';

export const Document = () => {
  const { id, title, imageUrl, fileType, isLoading } = useDocumentLogic();

  if (isLoading) {
    return null;
  }

  return <Case.Documents hideOpenExternalButton documents={[{ id, title, imageUrl, fileType }]} />;
};
