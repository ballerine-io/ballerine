import { ALLOWED_DOCUMENT_FILE_EXTENSIONS, AnyObject, ctw } from '@/common';
import { IHttpParams } from '@/common/hooks/useHttp';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { createTestId } from '@/components/organisms/Renderer/utils/create-test-id';
import { Upload, XCircle } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useElementId, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { useTaskRunner } from '../../providers/TaskRunner/hooks/useTaskRunner';
import { IFormElement, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { IFileFieldParams } from '../FileField';
import { useDocumentState } from './hooks/useDocumentState';
import { useDocumentFile } from '../../../DocumentsService';
import { useDynamicForm } from '../../context';
import { useDeleteDocumentFiles } from './hooks/useDeleteDocument';
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { useDynamicDocumentDefinition } from './hooks/useDynamicDocumentDefinition';

export type TDocumentStatus = 'requested' | 'provided' | 'unprovided';
export type TDocumentDecision = 'approved' | 'rejected' | 'revisions';
export interface IDocumentTemplate<TDocument extends { id: string } = { id: string }> {
  // Document id from the template
  id: string;
  category: string;
  type: string;
  issuer: {
    country: string;
  };
  version: number;
  issuingVersion: number;
  properties: AnyObject;
  pages: AnyObject[];
  _document?: TDocument;
}

export interface IDocumentFieldParams extends Omit<IFileFieldParams, 'httpParams'> {
  template: IDocumentTemplate;
  pageIndex?: number;
  pageProperty?: string;
  documentType: string;
  documentVariant: string;
  httpParams?: {
    createDocument?: IHttpParams;
    deleteDocument?: IHttpParams;
    updateDocument?: IHttpParams;
  };
}

export const DOCUMENT_FIELD_TYPE = 'documentfield';

export const DocumentField: TDynamicFormField<IDocumentFieldParams> = ({ element: _element }) => {
  useMountEvent(_element);
  useUnmountEvent(_element);

  const { metadata } = useDynamicForm();

  const {
    file,
    isLoading: isLoadingFile,
    isFetching: isFetchingFile,
    document,
    removeFile,
  } = useDocumentFile({
    type: _element.params?.template?.type!,
    category: _element.params?.template?.category!,
    entityType: 'business',
    entityId: metadata.businessId!,
  });

  const element = useDynamicDocumentDefinition({
    element: _element as IFormElement<'documentfield', IDocumentFieldParams>,
    document: document ?? undefined,
    entityId: undefined,
  });

  const { deleteDocumentFiles, isDeletingDocumentFiles } = useDeleteDocumentFiles();

  const { params } = element;
  const { placeholder = 'Choose file', acceptFileFormats = ALLOWED_DOCUMENT_FILE_EXTENSIONS } =
    params || {};
  const { removeTask, getTaskById, isRunning } = useTaskRunner();
  const { documentState, updateState } = useDocumentState(
    element as IFormElement<'documentfield', IDocumentFieldParams>,
  );
  const { handleChange } = useDocumentUpload(
    element as IFormElement<'documentfield', IDocumentFieldParams>,
    element.params || ({} as IDocumentFieldParams),
  );

  useLayoutEffect(() => {
    if (document) {
      updateState(document);
    }
  }, [document, updateState]);

  const { stack } = useStack();
  const id = useElementId(element, stack);
  const { disabled, onChange, onBlur, onFocus } = useField<
    Array<IDocumentFieldParams['template']> | undefined
  >(element, stack, documentState);

  const task = useMemo(() => getTaskById(id), [getTaskById, id]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputOnContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const clearFileAndInput = useCallback(async () => {
    onChange([]);
    removeTask(id);

    if (document) {
      await deleteDocumentFiles(document.id);
    }

    removeFile();

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [document, removeFile, deleteDocumentFiles, onChange, removeTask, id]);

  const isShouldDisableInput = useMemo(() => {
    return (
      disabled || isDeletingDocumentFiles || (task && isRunning) || isLoadingFile || isFetchingFile
    );
  }, [disabled, isDeletingDocumentFiles, task, isRunning, isLoadingFile, isFetchingFile]);

  return (
    <FieldLayout element={element} elementState={documentState}>
      <div
        className={ctw(
          'relative flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4',
          {
            'pointer-events-none opacity-50': isShouldDisableInput,
          },
        )}
        onClick={focusInputOnContainerClick}
        data-testid={createTestId(element, stack)}
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
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
            onClick={async e => {
              e.stopPropagation();
              await clearFileAndInput();
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
          disabled={isShouldDisableInput}
          onChange={handleChange}
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
