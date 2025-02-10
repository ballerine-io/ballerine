import { AnyObject } from '@/common';
import { useHttp } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import get from 'lodash/get';
import set from 'lodash/set';
import { Loader2, Trash2Icon } from 'lucide-react';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDynamicForm } from '../../../../context';
import { IFormElement } from '../../../../types';
import { createOrUpdateFileIdOrFileInDocuments } from '../../../DocumentField/hooks/useDocumentUpload/helpers/create-or-update-fileid-or-file-in-documents';
import { StackProvider } from '../../../FieldList/providers/StackProvider';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';
import { useEntitySync } from '../../hooks/useEntitySync';
import { EntityFieldProvider } from '../../providers/EntityFieldProvider';
import { IEntity } from '../../types';
import { buildDocumentsCreationPayload } from './helpers/build-documents-creation-payload';
import { buildEntityCreationPayload } from './helpers/build-entity-for-creation';
import { updateEntities } from './helpers/update-entities';
import { useChildrenDisabledOnLock } from './hooks/useChildrenDisabledOnLock';
import { useEntityFieldsIsValid } from './hooks/useIsEntityFieldsValid';

interface IEntityFieldsProps {
  stack: TDeepthLevelStack;
  fieldId: string;
  entityId: string;
  entity: IEntity;
  element: IFormElement<any, IEntityFieldGroupParams>;
  elementsOverride: TRendererSchema;
  isRemovingEntity?: boolean;
  index: number;
  onRemoveClick: () => void;
  onChange: (entities: IEntity[]) => void;
}

export const EntityFields: FunctionComponent<IEntityFieldsProps> = ({
  stack,
  fieldId,
  entityId,
  element,
  entity,
  elementsOverride,
  isRemovingEntity,
  index,
  onRemoveClick,
  onChange,
}) => {
  const { metadata, values } = useDynamicForm();
  const [isCreatingEntity, setIsCreatingEntity] = useState(false);

  const { run: createEntity } = useHttp(
    element.params!.httpParams?.createEntity.httpParams,
    metadata,
  );
  const { run: uploadDocument } = useHttp(element.params!.httpParams?.uploadDocument, metadata);

  const { createEntityText = 'Create' } = element.params || {};

  const isValid = useEntityFieldsIsValid(element, index);
  const { isSyncing } = useEntitySync(element, entity, stack, isValid);

  const createEntityAndUploadDocuments = useCallback(async () => {
    setIsCreatingEntity(true);

    const context = values;

    const entitiesDestination = formatValueDestination(element.valueDestination, stack);

    let createEntityPayload: AnyObject;

    try {
      createEntityPayload = await buildEntityCreationPayload(element, entity, context);
    } catch (error) {
      console.error(error);
      toast.error('Failed to build entity creation payload.');
      setIsCreatingEntity(false);
      throw error;
    }

    let createdEntityId: string;

    try {
      createdEntityId = await createEntity(createEntityPayload);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create entity.');
      setIsCreatingEntity(false);
      throw error;
    }

    const entities = get(context, entitiesDestination, []);
    const createdEntity = { ...entity, id: createdEntityId };

    // UI Update
    const updatedEntities = updateEntities(entities, createdEntity);
    set(context, entitiesDestination, updatedEntities);

    const documentsCreationPayload = await buildDocumentsCreationPayload(element, context, {
      entityId: createdEntityId,
      stack: stack,
    });

    const documentUploadPromises = documentsCreationPayload.map(async document => {
      try {
        const documentId = await uploadDocument(document.payload);

        const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
          get(context, document.valueDestination, []),
          document.documentDefinition,
          documentId,
        );

        set(context, document.valueDestination, updatedDocuments);

        return documentId;
      } catch (error) {
        toast.error(`Failed to upload document.`, {
          description: (error as Error).message,
        });

        return null;
      }
    });

    try {
      await Promise.all(documentUploadPromises);

      onChange(updatedEntities);
    } catch (error) {
      console.error(error);

      toast.error('Failed to upload documents.');
      setIsCreatingEntity(false);
      throw error;
    }

    setIsCreatingEntity(false);

    toast.success('Entity created successfully.');
  }, [stack, element, values, createEntity, uploadDocument, entity, onChange]);

  const childrens = useChildrenDisabledOnLock(element, isCreatingEntity);

  const isShouldRenderLoading = useMemo(() => {
    return isRemovingEntity || isCreatingEntity || isSyncing;
  }, [isRemovingEntity, isCreatingEntity, isSyncing]);

  return (
    <EntityFieldProvider isSyncing={isSyncing} entityFieldGroupType={element.params?.type}>
      <div
        key={`${fieldId}-${entityId}`}
        className="flex flex-col gap-2"
        data-testid={`${fieldId}-fieldlist-item-${entityId}`}
      >
        <div className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={createEntityAndUploadDocuments}
            disabled={entity?.id ? true : isCreatingEntity || !isValid}
          >
            {createEntityText}
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={isShouldRenderLoading}
            onClick={isShouldRenderLoading ? undefined : onRemoveClick}
          >
            {isShouldRenderLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2Icon
                className="w-4 h-4 cursor-pointer font-bold"
                data-testid={`${fieldId}-fieldlist-item-remove-${entityId}`}
              />
            )}
          </Button>
        </div>
        <StackProvider stack={[...(stack || []), index]}>
          <Renderer
            elements={childrens || []}
            schema={elementsOverride as unknown as TRendererSchema}
          />
        </StackProvider>
      </div>
    </EntityFieldProvider>
  );
};
