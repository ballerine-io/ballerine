import { ctw } from '@/common';
import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { createTestId } from '@/components/organisms/Renderer/utils/create-test-id';
import get from 'lodash/get';
import set from 'lodash/set';
import { Upload, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDynamicForm } from '../../../../context';
import { useField } from '../../../../hooks/external';
import { useMountEvent } from '../../../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../../../layouts/FieldDescription';
import { FieldErrors } from '../../../../layouts/FieldErrors';
import { FieldLayout } from '../../../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../../../layouts/FieldPriorityReason';
import { IFormElement, TDynamicFormElement } from '../../../../types';
import { IDocumentFieldParams } from '../../../DocumentField';
import { createOrUpdateFileIdOrFileInDocuments } from '../../../DocumentField/hooks/useDocumentUpload/helpers/create-or-update-fileid-or-file-in-documents';
import { getFileOrFileIdFromDocumentsList } from '../../../DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { removeDocumentFromListByTemplateId } from '../../../DocumentField/hooks/useDocumentUpload/helpers/remove-document-from-list-by-template-id';
import { useStack } from '../../../FieldList';
import { TEntityFieldGroupType } from '../../EntityFieldGroup';
import { useEntityField } from '../../providers/EntityFieldProvider';
import { getEntityFieldGroupDocumentValueDestination } from './helpers/get-entity-field-group-document-value-destination';

export interface IEntityFieldGroupDocumentParams extends IDocumentFieldParams {
  type: TEntityFieldGroupType;
}

export const EntityFieldGroupDocument: TDynamicFormElement<
  'documentfield',
  IEntityFieldGroupDocumentParams
> = ({ element: _element }) => {
  const { metadata, values, fieldHelpers } = useDynamicForm();
  const { entityFieldGroupType, isSyncing } = useEntityField();

  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const element = useMemo(
    () => ({
      ..._element,
      valueDestination: getEntityFieldGroupDocumentValueDestination(
        entityFieldGroupType || (_element.params?.type as TEntityFieldGroupType),
      ),
    }),
    [_element, entityFieldGroupType],
  );

  const { run: deleteDocument, isLoading: isDeletingDocument } = useHttp(
    (element.params?.httpParams?.deleteDocument as IHttpParams) || {},
    metadata,
  );

  useMountEvent(element);
  useUnmountEvent(element);

  const { params } = element;
  const { placeholder = 'Choose file', acceptFileFormats = undefined } = params || {};

  const { stack } = useStack();
  const {
    value: documentsList,
    disabled,
    onChange,
    onBlur,
    onFocus,
  } = useField<Array<IDocumentFieldParams['template']> | undefined>(element, stack);
  const value = useMemo(
    () =>
      getFileOrFileIdFromDocumentsList(
        documentsList,
        element as IFormElement<'documentfield', IDocumentFieldParams>,
      ),
    [documentsList, element],
  );

  const file = useMemo(() => {
    if (value instanceof File) {
      return value;
    }

    if (typeof value === 'string') {
      return new File([], value);
    }

    return undefined;
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInputOnContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const clearFileAndInput = useCallback(async () => {
    if (!element.params?.template?.id) {
      console.warn('Template id is missing in element', element);

      return;
    }

    const fileIdOrFile = getFileOrFileIdFromDocumentsList(documentsList, element);

    if (typeof fileIdOrFile === 'string') {
      await deleteDocument({
        ids: [fileIdOrFile],
      });
    }

    const updatedDocuments = removeDocumentFromListByTemplateId(
      documentsList,
      element.params?.template?.id as string,
    );

    onChange(updatedDocuments);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [documentsList, element, deleteDocument, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const documents = get(documentsList || [], element.valueDestination);
      const updatedDocuments = createOrUpdateFileIdOrFileInDocuments(
        documents,
        element,
        e.target.files?.[0] as File,
      );

      set(valuesRef.current, element.valueDestination, updatedDocuments);

      fieldHelpers.setValues(structuredClone(valuesRef.current));

      onChange(updatedDocuments);
    },
    [onChange, fieldHelpers, valuesRef, element, documentsList],
  );

  return (
    <FieldLayout element={element}>
      <div
        className={ctw(
          'relative flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4',
          {
            'pointer-events-none opacity-50': disabled || isDeletingDocument || isSyncing,
          },
        )}
        onClick={focusInputOnContainerClick}
        data-testid={createTestId(element, stack)}
      >
        <div className="flex gap-3 text-[#007AFF]">
          <Upload />
          <span className="select-none whitespace-nowrap text-base font-bold">{placeholder}</span>
        </div>
        <span className="truncate text-sm">{file ? file.name : 'No File Choosen'}</span>
        {file && (
          <Button
            variant="ghost"
            size="icon"
            className="h-[28px] w-[28px] rounded-full"
            onClick={e => {
              e.stopPropagation();
              void clearFileAndInput();
            }}
          >
            <div className="rounded-full bg-white">
              <XCircle />
            </div>
          </Button>
        )}
        <Input
          data-testid={`${createTestId(element, stack)}-hidden-input`}
          type="file"
          placeholder={placeholder}
          accept={acceptFileFormats}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={inputRef}
          className="hidden"
        />
      </div>
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
