import { formatString } from '@/components/organisms/Form/DynamicForm/utils/format-string';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatHeaders } from './format-headers';
import { request } from './request';

vi.mock('axios');
vi.mock('@/components/organisms/Form/DynamicForm/utils/format-string');
vi.mock('./format-headers');

describe('request', () => {
  const mockAxios = vi.mocked(axios);
  const mockFormatString = vi.mocked(formatString);
  const mockFormatHeaders = vi.mocked(formatHeaders);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a request with formatted url and headers', async () => {
    const requestParams = {
      url: 'http://api.example.com/{path}',
      method: 'GET',
      headers: {
        Authorization: 'Bearer {token}',
      },
    } as const;
    const metadata = {
      path: 'test',
      token: '12345',
    };
    const mockResponse = { data: { result: 'success' } };

    mockFormatString.mockReturnValue('http://api.example.com/test');
    mockFormatHeaders.mockReturnValue({ Authorization: 'Bearer 12345' });
    mockAxios.mockResolvedValue(mockResponse);

    const result = await request(requestParams, metadata);

    expect(mockFormatString).toHaveBeenCalledWith('http://api.example.com/{path}', metadata);
    expect(mockFormatHeaders).toHaveBeenCalledWith({ Authorization: 'Bearer {token}' }, metadata);
    expect(mockAxios).toHaveBeenCalledWith({
      url: 'http://api.example.com/test',
      method: 'GET',
      headers: { Authorization: 'Bearer 12345' },
      data: undefined,
      timeout: 5000,
      withCredentials: true,
    });
    expect(result).toEqual({ result: 'success' });
  });

  it('should make a request with data when provided', async () => {
    const requestParams = {
      url: 'http://api.example.com/test',
      method: 'POST',
      headers: {},
    } as const;
    const data = { foo: 'bar' };
    const mockResponse = { data: { result: 'success' } };

    mockFormatString.mockReturnValue('http://api.example.com/test');
    mockFormatHeaders.mockReturnValue({});
    mockAxios.mockResolvedValue(mockResponse);

    const result = await request(requestParams, {}, data);

    expect(mockAxios).toHaveBeenCalledWith({
      url: 'http://api.example.com/test',
      method: 'POST',
      headers: {},
      data: { foo: 'bar' },
      timeout: 5000,
      withCredentials: true,
    });
    expect(result).toEqual({ result: 'success' });
  });

  it('should throw and log error when request fails', async () => {
    const requestParams = {
      url: 'http://api.example.com/test',
      method: 'GET',
      headers: {},
    } as const;
    const error = new Error('Request failed');

    mockFormatString.mockReturnValue('http://api.example.com/test');
    mockFormatHeaders.mockReturnValue({});
    mockAxios.mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error');

    await expect(request(requestParams, {})).rejects.toThrow('Request failed');
    expect(consoleSpy).toHaveBeenCalledWith('Failed to perform request.', error);
  });
});
