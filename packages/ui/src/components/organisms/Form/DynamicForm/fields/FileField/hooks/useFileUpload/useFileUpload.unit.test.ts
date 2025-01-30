import { useHttp } from '@/common/hooks/useHttp';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../../context';
import { useElement, useField } from '../../../../hooks/external';
import { useTaskRunner } from '../../../../providers/TaskRunner/hooks/useTaskRunner';
import { useStack } from '../../../FieldList/providers/StackProvider';
import { useFileUpload } from './useFileUpload';

vi.mock('@/common/hooks/useHttp');
vi.mock('../../../../hooks/external');
vi.mock('../../../../providers/TaskRunner/hooks/useTaskRunner');
vi.mock('../../../../context');
vi.mock('../../../FieldList/providers/StackProvider');

describe('useFileUpload', () => {
  const mockElement = {
    id: 'test-id',
    element: 'filefield',
    params: {
      uploadSettings: {
        url: 'test-url',
        resultPath: 'test.path',
      },
    },
    valueDestination: 'test.destination',
  };

  const mockParams = {
    uploadSettings: {
      url: 'test-url',
      resultPath: 'test.path',
    },
  };

  const mockFile = new File(['test'], 'test.txt');
  const mockEvent = {
    target: {
      files: [mockFile],
    },
  } as unknown as React.ChangeEvent<HTMLInputElement>;

  const mockOnChange = vi.fn();
  const mockAddTask = vi.fn();
  const mockRemoveTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useElement).mockReturnValue({
      id: 'test-id',
      originId: 'test-origin-id',
      hidden: false,
    });
    vi.mocked(useTaskRunner).mockReturnValue({
      addTask: mockAddTask,
      removeTask: mockRemoveTask,
      tasks: [],
      isRunning: false,
      runTasks: vi.fn(),
    });
    vi.mocked(useDynamicForm).mockReturnValue({
      metadata: {},
      values: {},
      touched: {},
      elementsMap: {},
      fieldHelpers: {},
    } as ReturnType<typeof useDynamicForm>);
    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn().mockResolvedValue('uploaded-file-url'),
      isLoading: false,
      error: null,
    });
    vi.mocked(useField).mockReturnValue({
      value: undefined,
      touched: false,
      disabled: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });
  });

  it('should handle file upload on change', async () => {
    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn().mockResolvedValue('uploaded-file-url'),
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useFileUpload(mockElement, mockParams));

    await result.current.handleChange(mockEvent);

    expect(useHttp).toHaveBeenCalledWith(mockElement.params.uploadSettings, {});
    expect(mockOnChange).toHaveBeenCalledWith('uploaded-file-url');
  });

  it('should handle file upload on submit', async () => {
    const mockParamsWithSubmit = {
      uploadSettings: {
        url: 'test-url',
        resultPath: 'test.path',
      },
      uploadOn: 'submit' as const,
    };

    const { result } = renderHook(() => useFileUpload(mockElement, mockParamsWithSubmit));

    await result.current.handleChange(mockEvent);

    expect(mockOnChange).toHaveBeenCalledWith(mockFile);
    expect(mockAddTask).toHaveBeenCalled();
  });

  it('should handle missing upload settings', async () => {
    const mockElementWithoutSettings = {
      ...mockElement,
      params: {
        uploadSettings: undefined as any,
      },
    };
    const mockParamsWithoutSettings = {
      uploadSettings: undefined,
    } as any;

    const consoleSpy = vi.spyOn(console, 'log');

    const { result } = renderHook(() =>
      useFileUpload(mockElementWithoutSettings, mockParamsWithoutSettings),
    );

    await result.current.handleChange(mockEvent);

    expect(mockOnChange).toHaveBeenCalledWith(mockFile);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload, no upload settings provided');
  });

  it('should handle upload error on change', async () => {
    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn().mockRejectedValue(new Error('Upload failed')),
      isLoading: false,
      error: null,
    });

    const consoleSpy = vi.spyOn(console, 'error');

    const { result } = renderHook(() => useFileUpload(mockElement, mockParams));

    await result.current.handleChange(mockEvent);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload file.', expect.any(Error));
  });

  it('should handle upload error on submit', async () => {
    const mockParamsWithSubmit = {
      uploadSettings: {
        url: 'test-url',
        resultPath: 'test.path',
      },
      uploadOn: 'submit' as const,
    };

    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn().mockRejectedValue(new Error('Upload failed')),
      isLoading: false,
      error: null,
    });

    const consoleSpy = vi.spyOn(console, 'error');

    const { result } = renderHook(() => useFileUpload(mockElement, mockParamsWithSubmit));

    await result.current.handleChange(mockEvent);

    const addedTask = mockAddTask.mock.calls[0][0];
    const context = {};
    await addedTask.run(context);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload file.', expect.any(Error));
  });

  it('should remove existing task before handling change', async () => {
    const { result } = renderHook(() => useFileUpload(mockElement, mockParams));

    await result.current.handleChange(mockEvent);

    expect(mockRemoveTask).toHaveBeenCalledWith('test-id');
  });

  it('should return correct loading state', () => {
    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn(),
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useFileUpload(mockElement, mockParams));

    expect(result.current.isUploading).toBe(true);
  });
});
