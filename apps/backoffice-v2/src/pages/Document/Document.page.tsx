import { useDocumentLogic } from '@/pages/Document/hooks/useDocumentLogic/useDocumentLogic';
import { Case } from '../Entity/components/Case/Case';

interface IDocumentProps {
  isPage?: boolean;
}

export const Document = ({ isPage }: IDocumentProps) => {
  const { documents, isLoading } = useDocumentLogic();

  if (isLoading) {
    return null;
  }

  return <Case.Documents hideOpenExternalButton documents={documents} isPage={isPage} />;
};
