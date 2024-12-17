vi.mock('react', () => ({
  useMemo: vi.fn(vi.fn()),
  createContext: vi.fn(() => ({
    Provider: vi.fn(),
  })),
}));

vi.mock('./context/stack-provider-context', () => ({
  StackProviderContext: {
    Provider: vi.fn(),
  },
}));

import { render } from '@testing-library/react';
import { useMemo } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StackProvider } from './StackProvider';
import { StackProviderContext } from './context/stack-provider-context';

describe('StackProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create context with provided stack', () => {
    const mockStack = [1, 2, 3];

    render(
      <StackProvider stack={mockStack}>
        <div>Test Child</div>
      </StackProvider>,
    );

    expect(useMemo).toHaveBeenCalled();
    expect(vi.mocked(useMemo).mock.calls[0]?.[0]()).toEqual({ stack: mockStack });
  });

  it('should create context with empty array stack when not provided', () => {
    render(
      <StackProvider>
        <div>Test Child</div>
      </StackProvider>,
    );

    expect(useMemo).toHaveBeenCalled();
    expect(vi.mocked(useMemo).mock.calls[0]?.[0]()).toEqual({ stack: undefined });
  });

  it('should pass context value to provider', () => {
    const mockStack = [1, 2, 3];
    const mockContext = { stack: mockStack };

    vi.mocked(useMemo).mockReturnValue(mockContext);

    render(
      <StackProvider stack={mockStack}>
        <div>Test Child</div>
      </StackProvider>,
    );

    expect(StackProviderContext.Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        value: mockContext,
        children: expect.anything(),
      }),
      {},
    );
  });
});
