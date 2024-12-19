import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../../context';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { IFormElement } from '../../../../types';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { IFileFieldParams } from '../../FileField';
import { formatHeaders, uploadFile } from './helpers';
import { useFileUpload } from './useFileUpload';

vi.mock('../../../../context');
vi.mock('../../../../hooks/external');
vi.mock('../../../../providers/TaskRunner/hooks/useTaskRunner');
vi.mock('../../../FieldList/providers/StackProvider');
vi.mock('./helpers');

describe('useFileUpload', () => {
  const mockElement = {
    id: 'test-file',
    params: {
      uploadSettings: {
        url: 'test-url',
        resultPath: 'test-path',
      },
    },
  } as IFormElement<string, IFileFieldParams>;

  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const mockEvent = {
    target: {
      files: [mockFile],
    },
  } as unknown as React.ChangeEvent<HTMLInputElement>;

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({
      stack: [],
    });

    vi.mocked(useElement).mockReturnValue({
      id: 'test-file',
      originId: 'test-file',
      hidden: false,
    });

    vi.mocked(useTaskRunner).mockReturnValue({
      addTask: vi.fn(),
      removeTask: vi.fn(),
      tasks: [],
      isRunning: false,
      runTasks: vi.fn(),
    });

    vi.mocked(useDynamicForm).mockReturnValue({
      metadata: {},
      fieldHelpers: {
        getTouched: vi.fn(),
        getValue: vi.fn(),
        setTouched: vi.fn(),
        setValue: vi.fn(),
        touchAllFields: vi.fn(),
      },
      values: {},
      touched: {},
      elementsMap: {},
      callbacks: {},
      submit: vi.fn(),
    });

    vi.mocked(useField).mockReturnValue({
      value: null,
      touched: false,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });

    vi.mocked(uploadFile).mockResolvedValue('uploaded-file-result');
    vi.mocked(formatHeaders).mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('handles file upload on change', async () => {
    const { result } = renderHook(() => useFileUpload(mockElement, { uploadOn: 'change' }));

    await result.current.handleChange(mockEvent);

    expect(vi.mocked(uploadFile)).toHaveBeenCalledWith(mockFile, expect.any(Object));
    expect(vi.mocked(useField).mock.results?.[0]?.value?.onChange).toHaveBeenCalledWith(
      'uploaded-file-result',
    );
  });

  it('handles file upload on submit', async () => {
    const { result } = renderHook(() => useFileUpload(mockElement, { uploadOn: 'submit' }));

    await result.current.handleChange(mockEvent);

    expect(vi.mocked(useField).mock.results?.[0]?.value?.onChange).toHaveBeenCalledWith(mockFile);
    expect(vi.mocked(useTaskRunner).mock.results?.[0]?.value?.addTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-file',
        element: mockElement,
        run: expect.any(Function),
      }),
    );
  });

  it('removes existing task before handling new file', async () => {
    const { result } = renderHook(() => useFileUpload(mockElement));

    await result.current.handleChange(mockEvent);

    expect(vi.mocked(useTaskRunner).mock.results?.[0]?.value?.removeTask).toHaveBeenCalledWith(
      'test-file',
    );
  });

  it('handles upload failure gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    vi.mocked(uploadFile).mockRejectedValueOnce(new Error('Upload failed'));

    const { result } = renderHook(() => useFileUpload(mockElement, { uploadOn: 'change' }));

    await result.current.handleChange(mockEvent);

    expect(consoleError).toHaveBeenCalledWith('Failed to upload file.', expect.any(Error));
    consoleError.mockRestore();
  });

  it('formats headers with metadata', async () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      metadata: { token: '123' },
      fieldHelpers: {
        getTouched: vi.fn(),
        getValue: vi.fn(),
        setTouched: vi.fn(),
        setValue: vi.fn(),
        touchAllFields: vi.fn(),
      },
      values: {},
      touched: {},
      elementsMap: {},
      callbacks: {},
      submit: vi.fn(),
    });

    const { result } = renderHook(() =>
      useFileUpload(mockElement, {
        uploadSettings: {
          headers: { Authorization: 'Bearer {token}' },
          url: 'test-url',
          resultPath: 'test-path',
        },
      }),
    );

    await result.current.handleChange(mockEvent);

    expect(vi.mocked(formatHeaders)).toHaveBeenCalledWith(
      { Authorization: 'Bearer {token}' },
      { token: '123' },
    );
  });
});
