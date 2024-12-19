import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { formatHeaders, uploadFile } from './helpers';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('formatHeaders', () => {
  it('should return empty object when no headers provided', () => {
    const result = formatHeaders({});
    expect(result).toEqual({});
  });

  it('should return headers without modification when no metadata matches', () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    };
    const result = formatHeaders(headers);
    expect(result).toEqual(headers);
  });

  it('should replace metadata placeholders in headers', () => {
    const headers = {
      Authorization: 'Bearer {token}',
      'X-User-Id': '{userId}',
    };
    const metadata = {
      token: 'abc123',
      userId: '12345',
    };
    const expected = {
      Authorization: 'Bearer abc123',
      'X-User-Id': '12345',
    };
    const result = formatHeaders(headers, metadata);
    expect(result).toEqual(expected);
  });

  it('should keep original placeholder if metadata key not found', () => {
    const headers = {
      Authorization: 'Bearer {token}',
      'X-User-Id': '{userId}',
    };
    const metadata = {
      token: 'abc123',
    };
    const expected = {
      Authorization: 'Bearer abc123',
      'X-User-Id': '{userId}',
    };
    const result = formatHeaders(headers, metadata);
    expect(result).toEqual(expected);
  });
});

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
