import { ctw } from '@/common';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { createTestId } from '@/components/organisms/Renderer/utils/create-test-id';
import { Upload, XCircle } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import { useElement, useField } from '../../hooks/external';
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
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { getFileOrFileIdFromDocumentsList } from './hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { removeDocumentFromListByTemplateId } from './hooks/useDocumentUpload/helpers/remove-document-from-list-by-template-id';

export interface IDocumentFieldParams<
  TTemplate extends { id: string; pages: Array<{ [key: string]: string }> } = {
    id: string;
    pages: [];
  },
> extends IFileFieldParams {
  template: TTemplate;
  pageIndex?: number;
  pageProperty?: string;
}

export const DOCUMENT_FIELD_TYPE = 'documentfield';

export const DocumentField: TDynamicFormField<IDocumentFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);
  const { handleChange, isUploading: disabledWhileUploading } = useDocumentUpload(
    element as IFormElement<'documentfield', IDocumentFieldParams>,
    element.params || ({} as IDocumentFieldParams),
  );

  const { params } = element;
  const { placeholder = 'Choose file', acceptFileFormats = undefined } = params || {};
  const { removeTask } = useTaskRunner();

  const { stack } = useStack();
  const { id } = useElement(element, stack);
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

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputOnContainerClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const file = useMemo(() => {
    if (value instanceof File) return value;

    if (typeof value === 'string') return new File([], value);

    return undefined;
  }, [value]);

  const clearFileAndInput = useCallback(() => {
    if (!element.params?.template?.id) {
      console.warn('Template id is migging in element', element);

      return;
    }

    const updatedDocuments = removeDocumentFromListByTemplateId(
      documentsList,
      element.params?.template?.id as string,
    );

    onChange(updatedDocuments);
    removeTask(id);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [documentsList, element, onChange, id, removeTask]);

  return (
    <FieldLayout element={element}>
      <div
        className={ctw(
          'relative flex h-[56px] flex-row items-center gap-3 rounded-[16px] border bg-white px-4',
          { 'pointer-events-none opacity-50': disabled || disabledWhileUploading },
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
              clearFileAndInput();
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
          disabled={disabled || disabledWhileUploading}
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
