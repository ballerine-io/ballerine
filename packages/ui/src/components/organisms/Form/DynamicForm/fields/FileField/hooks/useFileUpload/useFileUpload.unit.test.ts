import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatHeaders, uploadFile } from './helpers';
import { useFileUpload } from './useFileUpload';

vi.mock('./helpers', () => ({
  uploadFile: vi.fn(),
  formatHeaders: vi.fn(),
}));

vi.mock('../../../../context', () => ({
  useDynamicForm: () => ({
    metadata: { test: 'metadata' },
  }),
}));

vi.mock('../../../../hooks/external', () => ({
  useElement: () => ({ id: 'test-id' }),
  useField: () => ({ onChange: vi.fn() }),
}));

vi.mock('../../../../providers/TaskRunner/hooks/useTaskRunner', () => ({
  useTaskRunner: () => ({
    addTask: vi.fn(),
    removeTask: vi.fn(),
  }),
}));

vi.mock('../../../FieldList/providers/StackProvider', () => ({
  useStack: () => ({ stack: [] }),
}));

const mockedUploadFile = vi.mocked(uploadFile);
const mockedFormatHeaders = vi.mocked(formatHeaders);

describe('useFileUpload', () => {
  const mockElement = {
    id: 'test-field',
    element: 'file',
    valueDestination: 'file',
  };

  const createEvent = (file: File) =>
    ({
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle file change without upload settings', async () => {
    const { result } = renderHook(() => useFileUpload(mockElement, {}));
    const mockFile = new File(['test'], 'test.txt');

    await act(async () => {
      await result.current.handleChange(createEvent(mockFile));
    });

    expect(mockedUploadFile).not.toHaveBeenCalled();
  });

  it('should upload file immediately when uploadOn is "change"', async () => {
    const uploadSettings = {
      url: 'test-url',
      resultPath: 'data.url',
      headers: { 'Content-Type': 'application/json' },
    };

    mockedUploadFile.mockResolvedValue('uploaded-file-url');
    mockedFormatHeaders.mockReturnValue({ 'Content-Type': 'application/json' });

    const { result } = renderHook(() =>
      useFileUpload(mockElement, {
        uploadOn: 'change',
        uploadSettings,
      }),
    );

    const mockFile = new File(['test'], 'test.txt');

    await act(async () => {
      await result.current.handleChange(createEvent(mockFile));
    });

    expect(mockedUploadFile).toHaveBeenCalledWith(
      mockFile,
      expect.objectContaining({
        url: 'test-url',
        method: 'POST',
        resultPath: 'data.url',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('should queue upload task when uploadOn is "submit"', async () => {
    const uploadSettings = {
      url: 'test-url',
      resultPath: 'data.url',
      headers: { 'Content-Type': 'application/json' },
    };

    const { result } = renderHook(() =>
      useFileUpload(mockElement, {
        uploadOn: 'submit',
        uploadSettings,
      }),
    );

    const mockFile = new File(['test'], 'test.txt');

    await act(async () => {
      await result.current.handleChange(createEvent(mockFile));
    });

    expect(mockedUploadFile).not.toHaveBeenCalled();
  });

  it('should handle upload errors gracefully', async () => {
    const uploadSettings = {
      url: 'test-url',
      resultPath: 'data.url',
      headers: { 'Content-Type': 'application/json' },
    };

    mockedUploadFile.mockRejectedValue(new Error('Upload failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn() as any);

    const { result } = renderHook(() =>
      useFileUpload(mockElement, {
        uploadOn: 'change',
        uploadSettings,
      }),
    );

    const mockFile = new File(['test'], 'test.txt');

    await act(async () => {
      await result.current.handleChange(createEvent(mockFile));
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload file.', expect.any(Error));
    expect(result.current.isUploading).toBe(false);

    consoleSpy.mockRestore();
  });
});
