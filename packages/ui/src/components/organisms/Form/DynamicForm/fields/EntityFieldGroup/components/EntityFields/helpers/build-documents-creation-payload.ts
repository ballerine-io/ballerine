import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { IEntityFieldGroupParams } from '../../../EntityFieldGroup';
import { IDocumentCreationData } from '@/components/organisms/Form/DocumentsService/types';
import { formatDocumentId } from '@/components/organisms/Form/DynamicForm/utils/format-document-id';
import { IEntity } from '../../../types';

export interface IDocumentCreationPayload {
  documentData: IDocumentCreationData;
  entity: IEntity;
  file: File;
}

export const buildDocumentsCreationPayload = ({
  element,
  entities,
  files,
}: {
  element: IFormElement<any, IEntityFieldGroupParams>;
  entities: IEntity[];
  files: Record<string, File>;
}): IDocumentCreationPayload[] => {
  const documentElements = element.children?.filter(
    child => child.element === 'documentfield',
  ) as Array<IFormElement<'documentfield', IDocumentFieldParams>>;

  if (!documentElements?.length) return [];

  const creationPayload: IDocumentCreationPayload[] = [];

  entities.forEach(entity => {
    documentElements.forEach(documentElement => {
      const creationData: IDocumentCreationData = {
        category: documentElement.params?.template?.category!,
        type: documentElement.params?.template?.type!,
        issuingVersion: documentElement.params?.template?.issuingVersion!,
        issuingCountry: documentElement.params?.template?.issuer.country!,
        documentType: documentElement.params?.documentType!,
        documentVariant: documentElement.params?.documentVariant!,
        documentPage: documentElement.params?.pageIndex! || 1,
        entityId: entity.ballerineEntityId!,
        entityType: 'ubo' as const,
      };

      const idToFileByEntityId = formatDocumentId({
        type: documentElement.params?.template?.type!,
        category: documentElement.params?.template?.category!,
        entityType: 'ubo',
        entityId: entity.ballerineEntityId!,
      });

      const idToFileByTempId = formatDocumentId({
        type: documentElement.params?.template?.type!,
        category: documentElement.params?.template?.category!,
        entityType: 'ubo',
        entityId: entity.__id!,
      });

      const file = files[idToFileByEntityId] || files[idToFileByTempId];

      if (!file) {
        console.warn('File is missing for document', idToFileByEntityId, idToFileByTempId);
        return;
      }

      creationPayload.push({
        documentData: creationData,
        entity,
        file,
      });
    });
  });

  return creationPayload;
};
