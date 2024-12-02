import { useDocumentLogic } from '@/pages/Document/hooks/useDocumentLogic/useDocumentLogic';
import { Case } from '../Entity/components/Case/Case';

interface IDocumentProps {
  wrapperClassName?: string;
}

export const Document = ({ wrapperClassName }: IDocumentProps) => {
  const { documents, isLoading } = useDocumentLogic();

  if (isLoading) {
    return null;
  }

  return (
    <Case.Documents
      hideOpenExternalButton
      documents={documents}
      wrapperClassName={wrapperClassName}
    />
  );
};
