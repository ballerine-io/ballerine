import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import {
  IFormElement,
  TDeepthLevelStack,
  useDynamicForm,
  useField,
} from '@/components/organisms/Form';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createOrUpdateFileIdOrFileInDocuments } from '../../../DocumentField/hooks/useDocumentUpload/helpers/create-or-update-fileid-or-file-in-documents';
import { buildDocumentsCreationPayload } from '../../components/EntityFields/helpers/build-documents-creation-payload';
import { transform } from '../../components/EntityFields/utils/transform';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';
import { IEntity } from '../../types';

export const useEntitySync = (
  element: IFormElement<any, IEntityFieldGroupParams>,
  entity: IEntity,
  stack: TDeepthLevelStack,
  isValid: boolean,
) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { values, metadata, fieldHelpers } = useDynamicForm();
  const { run: uploadDocument } = useHttp(element.params!.httpParams?.uploadDocument, metadata);
  const contextRef = useRef(values);
  const { value, onChange } = useField(element, stack);

  const prevEntityRef = useRef(entity);

  useEffect(() => {
    contextRef.current = values;
  }, [values]);

  const isValidRef = useRef(isValid);

  useEffect(() => {
    isValidRef.current = isValid;
  }, [isValid]);

  const { run: updateEntity } = useHttp(
    element.params?.httpParams?.updateEntity.httpParams || ({} as IHttpParams),
    metadata,
  );

  const debouncedSync = useCallback(
    debounce(async (entity: IEntity) => {
      if (!isValidRef.current) {
        return;
      }

      const { id: _, ...prevEntity } = prevEntityRef.current || {};
      const { id: __, ...currentEntity } = entity || {};

      if (isEqual(prevEntity, currentEntity)) {
        return;
      }

      try {
        setIsSyncing(true);

        // Updating entity
        await updateEntity(
          await transform(
            contextRef.current,
            entity,
            element.params?.httpParams?.updateEntity.transform as string,
          ),
          { params: { entityId: entity.id } },
        );

        prevEntityRef.current = entity;
      } catch (error) {
        toast.error('Failed to sync entity.');
        console.error(error);

        setIsSyncing(false);
      }

      try {
        const documentsCreationPayload = await buildDocumentsCreationPayload(
          element,
          contextRef.current,
          {
            entityId: entity.id!,
            stack: stack,
          },
        );

        // Updating documents
        const documentUploadPromises = documentsCreationPayload.map(async document => {
          const documentId = await uploadDocument(document.payload);

          const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
            get(contextRef.current, document.valueDestination, []),
            document.documentDefinition,
            documentId,
          );

          set(contextRef.current, document.valueDestination, updatedDocuments);

          return documentId;
        });

        await Promise.all(documentUploadPromises);
      } catch (error) {
        toast.error('Failed to sync documents.');
        console.error(error);

        setIsSyncing(false);
      }

      onChange(structuredClone(get(contextRef.current, element.valueDestination, [])));

      setIsSyncing(false);
    }, 1000),
    [contextRef, isValidRef],
  );

  useEffect(() => {
    if (!entity?.id) {
      return;
    }

    void debouncedSync(entity);
  }, [entity, debouncedSync]);

  return {
    isSyncing,
  };
};
