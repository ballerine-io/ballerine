import { formatString } from '@/components/organisms/Form/DynamicForm/utils/format-string';
import { describe, expect, it, vi } from 'vitest';
import { formatHeaders } from './format-headers';

vi.mock('@/components/organisms/Form/DynamicForm/utils/format-string', () => ({
  formatString: vi.fn(),
}));

const mockedFormatString = vi.mocked(formatString);

describe('formatHeaders', () => {
  it('should format headers with metadata', () => {
    const headers = {
      Authorization: 'Bearer {token}',
      'Content-Type': 'application/json',
    };

    const metadata = {
      token: 'abc123',
    };

    mockedFormatString.mockReturnValueOnce('Bearer abc123').mockReturnValueOnce('application/json');

    const result = formatHeaders(headers, metadata);

    expect(result).toEqual({
      Authorization: 'Bearer abc123',
      'Content-Type': 'application/json',
    });

    expect(mockedFormatString).toHaveBeenCalledTimes(2);
    expect(mockedFormatString).toHaveBeenCalledWith('Bearer {token}', metadata);
    expect(mockedFormatString).toHaveBeenCalledWith('application/json', metadata);
  });

  it('should handle empty headers', () => {
    const result = formatHeaders({});

    expect(result).toEqual({});
    expect(mockedFormatString).not.toHaveBeenCalled();
  });

  it('should use empty metadata object if not provided', () => {
    const headers = {
      'X-Custom': 'test',
    };

    mockedFormatString.mockReturnValueOnce('test');

    const result = formatHeaders(headers);

    expect(result).toEqual({
      'X-Custom': 'test',
    });

    expect(mockedFormatString).toHaveBeenCalledWith('test', {});
  });
});
