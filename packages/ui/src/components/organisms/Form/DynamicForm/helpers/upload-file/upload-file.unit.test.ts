import { describe, expect, it, vi } from 'vitest';

import axios from 'axios';
import { uploadFile } from './upload-file';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('uploadFile', () => {
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const mockParams = {
    url: 'http://test.com/upload',
    method: 'POST' as const,
    headers: { 'Content-Type': 'multipart/form-data' },
    resultPath: 'fileUrl',
  };

  it('should throw error if no params provided', async () => {
    await expect(uploadFile(mockFile, undefined)).rejects.toThrow(
      'Upload settings are required to upload a file',
    );
  });

  it('should upload file successfully and return result from specified path', async () => {
    const mockResponse = {
      data: {
        fileUrl: 'http://test.com/files/test.txt',
      },
    };

    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await uploadFile(mockFile, mockParams);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: mockParams.url,
      headers: mockParams.headers,
      data: expect.any(FormData),
    });
    expect(result).toBe(mockResponse.data.fileUrl);
  });

  it('should use POST as default method if not specified', async () => {
    const paramsWithoutMethod = {
      url: 'http://test.com/upload',
      headers: {},
      resultPath: 'data.fileUrl',
    };

    mockedAxios.mockResolvedValueOnce({ data: { fileUrl: 'test' } });

    await uploadFile(mockFile, paramsWithoutMethod);

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('should use empty object as default headers if not specified', async () => {
    const paramsWithoutHeaders = {
      url: 'http://test.com/upload',
      method: 'POST' as const,
      resultPath: 'data.fileUrl',
    };

    mockedAxios.mockResolvedValueOnce({ data: { fileUrl: 'test' } });

    await uploadFile(mockFile, paramsWithoutHeaders);

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {},
      }),
    );
  });
});
